import { Injectable } from "@nestjs/common";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import argon2 from "argon2";
import { and, asc, eq, inArray } from "drizzle-orm";
import { loadConfig } from "../../../config.js";
import { AuditService } from "../../../building-blocks/audit/audit.service.js";
import { DatabaseService } from "../../../building-blocks/database/database.service.js";
import { AppError } from "../../../building-blocks/http/app-error.js";
import { newId } from "../../../building-blocks/ids/uuid.js";
import { tenants, entitlements } from "../../platform/persistence.js";
import { farms } from "../../farm/persistence.js";
import { farmAssignments, memberships, rolePermissions, roles, sessions, userRoles, users } from "../infrastructure/schema.js";
import { foundationPermissionCodes } from "../domain/permissions.js";

interface LoginRow {
  user_id: string; password_hash: string; user_status: string; tenant_id: string;
  membership_status: string; is_tenant_owner: boolean; tenant_status: string;
}
interface SessionRow {
  session_id: string; user_id: string; tenant_id: string; user_status: string;
  membership_status: string; tenant_status: string; is_tenant_owner: boolean; permission_code: string | null;
}

export interface SessionPrincipalData {
  readonly userId: string; readonly tenantId: string; readonly sessionId: string;
  readonly permissions: ReadonlySet<string>; readonly isTenantOwner: boolean;
}

export interface SessionResult { readonly accessToken: string; readonly expiresAt: string }

@Injectable()
export class AuthService {
  private readonly config = loadConfig();
  constructor(private readonly database: DatabaseService, private readonly audit: AuditService) {}

  async bootstrap(input: { displayName: string; email: string; password: string; bootstrapToken?: string }): Promise<SessionResult & { tenantId: string; userId: string }> {
    if (!this.config.bootstrapToken || !input.bootstrapToken || !this.constantTimeEqual(this.config.bootstrapToken, input.bootstrapToken)) {
      throw new AppError(403, "ACTION_FORBIDDEN", "Bootstrap registration is not available.");
    }
    const now = new Date();
    const tenantId = newId(); const userId = newId(); const membershipId = newId();
    const ownerRoleId = newId(); const managerRoleId = newId(); const workerRoleId = newId();
    const passwordHash = await argon2.hash(input.password, { type: argon2.argon2id });
    const email = input.email.trim().toLowerCase();

    await this.database.runInBootstrapTransaction(async (transaction) => {
      await transaction.db.insert(tenants).values({ id: tenantId, displayName: input.displayName.trim(), status: "ACTIVE", createdAt: now, updatedAt: now });
      await transaction.setTenant(tenantId);
      await transaction.db.insert(users).values({ id: userId, email, displayName: input.displayName.trim(), passwordHash, status: "ACTIVE", createdAt: now, updatedAt: now });
      await transaction.db.insert(memberships).values({ id: membershipId, tenantId, userId, status: "ACTIVE", isTenantOwner: true, createdAt: now });
      await transaction.db.insert(roles).values([
        { id: ownerRoleId, tenantId, code: "TENANT_OWNER", displayName: "Tenant Owner", system: true, version: 1, createdAt: now },
        { id: managerRoleId, tenantId, code: "FARM_MANAGER", displayName: "Farm Manager", system: true, version: 1, createdAt: now },
        { id: workerRoleId, tenantId, code: "WORKER", displayName: "Worker", system: true, version: 1, createdAt: now },
      ]);
      await transaction.db.insert(rolePermissions).values(foundationPermissionCodes.map((permissionCode) => ({ tenantId, roleId: ownerRoleId, permissionCode })));
      await transaction.db.insert(rolePermissions).values([
        "organization.read", "farm.read", "farm.create", "farm.update", "users.read",
      ].map((permissionCode) => ({ tenantId, roleId: managerRoleId, permissionCode })));
      await transaction.db.insert(rolePermissions).values([{ tenantId, roleId: workerRoleId, permissionCode: "farm.read" }]);
      await transaction.db.insert(userRoles).values({ id: newId(), tenantId, userId, roleId: ownerRoleId, createdAt: now });
      await transaction.db.insert(entitlements).values({ id: newId(), tenantId, capability: "foundation", status: "ACTIVE", createdAt: now });
      await this.audit.append(transaction.db, { tenantId, actorId: userId, action: "tenant.bootstrap", entityType: "tenant", entityId: tenantId, change: { after: { displayName: input.displayName, status: "ACTIVE" } }, source: "BOOTSTRAP" });
    });
    const session = await this.createSession(tenantId, userId);
    return { ...session, tenantId, userId };
  }

  async login(emailInput: string, password: string): Promise<SessionResult> {
    const email = emailInput.trim().toLowerCase();
    const rows = await this.database.queryGlobal<LoginRow>("select * from identity.resolve_login($1)", [email]);
    const row = rows[0];
    const valid = row ? await argon2.verify(row.password_hash, password) : await argon2.verify(await argon2.hash("not-the-password"), password).catch(() => false);
    if (!row || !valid || row.user_status !== "ACTIVE" || row.membership_status !== "ACTIVE" || row.tenant_status !== "ACTIVE") {
      throw new AppError(401, "AUTHENTICATION_REQUIRED", "Invalid credentials or unavailable account.");
    }
    return this.createSession(row.tenant_id, row.user_id);
  }

  async resolveSession(accessToken: string): Promise<SessionPrincipalData | undefined> {
    const rows = await this.database.queryGlobal<SessionRow>("select * from identity.resolve_session($1)", [this.hashToken(accessToken)]);
    const first = rows[0];
    if (!first || first.user_status !== "ACTIVE" || first.membership_status !== "ACTIVE" || first.tenant_status !== "ACTIVE") return undefined;
    return { userId: first.user_id, tenantId: first.tenant_id, sessionId: first.session_id, isTenantOwner: first.is_tenant_owner, permissions: new Set(rows.flatMap((row) => row.permission_code ? [row.permission_code] : [])) };
  }

  async logout(principal: SessionPrincipalData): Promise<void> {
    await this.database.runInTenantTransaction(principal.tenantId, async (db) => {
      await db.update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.id, principal.sessionId));
      await this.audit.append(db, { tenantId: principal.tenantId, actorId: principal.userId, action: "session.revoked", entityType: "session", entityId: principal.sessionId });
    });
  }

  async getMe(principal: SessionPrincipalData): Promise<Record<string, unknown>> {
    return this.database.runInTenantTransaction(principal.tenantId, async (db) => {
      const [identity] = await db.select({ userId: users.id, displayName: users.displayName, email: users.email, tenantId: tenants.id, tenantDisplayName: tenants.displayName }).from(users).innerJoin(memberships, and(eq(memberships.userId, users.id), eq(memberships.tenantId, principal.tenantId))).innerJoin(tenants, eq(tenants.id, memberships.tenantId)).where(eq(users.id, principal.userId)).limit(1);
      if (!identity) throw new AppError(401, "AUTHENTICATION_REQUIRED", "The session is invalid or expired.");
      let visibleFarmIds: string[] | undefined;
      if (!principal.isTenantOwner) {
        visibleFarmIds = (await db.select({ farmId: farmAssignments.farmId }).from(farmAssignments).where(and(eq(farmAssignments.tenantId, principal.tenantId), eq(farmAssignments.userId, principal.userId)))).map((item) => item.farmId);
      }
      const accessibleFarms = visibleFarmIds?.length === 0 ? [] : await db.select({ id: farms.id, organizationId: farms.organizationId, code: farms.code, displayName: farms.displayName, timezone: farms.timezone, status: farms.status }).from(farms).where(and(eq(farms.tenantId, principal.tenantId), ...(visibleFarmIds ? [inArray(farms.id, visibleFarmIds)] : []))).orderBy(asc(farms.id)).limit(101);
      return {
        user: { id: identity.userId, displayName: identity.displayName, email: identity.email },
        tenant: { id: identity.tenantId, displayName: identity.tenantDisplayName },
        permissions: [...principal.permissions].sort(),
        farmScope: { allFarms: principal.isTenantOwner, accessibleFarms: accessibleFarms.slice(0, 100), truncated: accessibleFarms.length > 100 },
      };
    });
  }

  private async createSession(tenantId: string, userId: string): Promise<SessionResult> {
    const accessToken = randomBytes(32).toString("base64url");
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.config.sessionTtlHours * 60 * 60 * 1000);
    await this.database.runInTenantTransaction(tenantId, async (db) => {
      const sessionId = newId();
      await db.insert(sessions).values({ id: sessionId, tenantId, userId, tokenHash: this.hashToken(accessToken), expiresAt, createdAt: now, revokedAt: null });
      await this.audit.append(db, { tenantId, actorId: userId, action: "session.created", entityType: "session", entityId: sessionId });
    });
    return { accessToken, expiresAt: expiresAt.toISOString() };
  }

  private hashToken(token: string): string { return createHash("sha256").update(token).digest("hex"); }
  private constantTimeEqual(left: string, right: string): boolean {
    const a = Buffer.from(left); const b = Buffer.from(right);
    return a.length === b.length && timingSafeEqual(a, b);
  }
}
