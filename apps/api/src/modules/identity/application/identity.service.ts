import { Injectable } from "@nestjs/common";
import argon2 from "argon2";
import { and, asc, eq } from "drizzle-orm";
import { AuditService } from "../../../building-blocks/audit/audit.service.js";
import { DatabaseService } from "../../../building-blocks/database/database.service.js";
import { AppError } from "../../../building-blocks/http/app-error.js";
import { newId } from "../../../building-blocks/ids/uuid.js";
import { farms } from "../../farm/persistence.js";
import type { SessionPrincipalData } from "./auth.service.js";
import { farmAssignments, memberships, rolePermissions, roles, userRoles, users } from "../infrastructure/schema.js";

@Injectable()
export class IdentityService {
  constructor(private readonly database: DatabaseService, private readonly audit: AuditService) {}

  async createUser(principal: SessionPrincipalData, input: { email: string; displayName: string; temporaryPassword: string }): Promise<Record<string, unknown>> {
    const passwordHash = await argon2.hash(input.temporaryPassword, { type: argon2.argon2id });
    return this.database.runInTenantTransaction(principal.tenantId, async (db) => {
      const now = new Date(); const userId = newId();
      const [created] = await db.insert(users).values({ id: userId, email: input.email.trim().toLowerCase(), displayName: input.displayName.trim(), passwordHash, status: "ACTIVE", createdAt: now, updatedAt: now }).returning({ id: users.id, email: users.email, displayName: users.displayName, status: users.status });
      if (!created) throw new AppError(500, "INTERNAL_FAILURE", "User creation failed.");
      await db.insert(memberships).values({ id: newId(), tenantId: principal.tenantId, userId, status: "ACTIVE", isTenantOwner: false, createdAt: now });
      await this.audit.append(db, { tenantId: principal.tenantId, actorId: principal.userId, action: "user.created", entityType: "user", entityId: userId, change: { after: { email: created.email, displayName: created.displayName, status: created.status } } });
      return created;
    });
  }

  async listUsers(principal: SessionPrincipalData): Promise<readonly Record<string, unknown>[]> {
    return this.database.runInTenantTransaction(principal.tenantId, async (db) => db.select({ id: users.id, email: users.email, displayName: users.displayName, status: users.status, isTenantOwner: memberships.isTenantOwner }).from(memberships).innerJoin(users, eq(users.id, memberships.userId)).where(eq(memberships.tenantId, principal.tenantId)).orderBy(asc(users.id)).limit(100));
  }

  async listRoles(principal: SessionPrincipalData): Promise<readonly Record<string, unknown>[]> {
    return this.database.runInTenantTransaction(principal.tenantId, async (db) => db.select({ id: roles.id, code: roles.code, displayName: roles.displayName, version: roles.version }).from(roles).where(eq(roles.tenantId, principal.tenantId)).orderBy(asc(roles.code)).limit(100));
  }

  async assignRole(principal: SessionPrincipalData, userId: string, roleId: string): Promise<void> {
    await this.database.runInTenantTransaction(principal.tenantId, async (db) => {
      const [membership] = await db.select({ id: memberships.id }).from(memberships).where(and(eq(memberships.tenantId, principal.tenantId), eq(memberships.userId, userId))).limit(1);
      const [role] = await db.select({ id: roles.id }).from(roles).where(and(eq(roles.tenantId, principal.tenantId), eq(roles.id, roleId))).limit(1);
      if (!membership || !role) throw new AppError(404, "RESOURCE_NOT_FOUND", "User or role not found.");
      await db.insert(userRoles).values({ id: newId(), tenantId: principal.tenantId, userId, roleId, createdAt: new Date() }).onConflictDoNothing();
      await this.audit.append(db, { tenantId: principal.tenantId, actorId: principal.userId, action: "role.assigned", entityType: "user", entityId: userId, change: { after: { roleId } } });
    });
  }

  async assignFarm(principal: SessionPrincipalData, userId: string, farmId: string): Promise<void> {
    await this.database.runInTenantTransaction(principal.tenantId, async (db) => {
      const [membership] = await db.select({ id: memberships.id }).from(memberships).where(and(eq(memberships.tenantId, principal.tenantId), eq(memberships.userId, userId))).limit(1);
      const [farm] = await db.select({ id: farms.id }).from(farms).where(and(eq(farms.tenantId, principal.tenantId), eq(farms.id, farmId))).limit(1);
      if (!membership || !farm) throw new AppError(404, "RESOURCE_NOT_FOUND", "User or farm not found.");
      await db.insert(farmAssignments).values({ id: newId(), tenantId: principal.tenantId, userId, farmId, createdAt: new Date() }).onConflictDoNothing();
      await this.audit.append(db, { tenantId: principal.tenantId, actorId: principal.userId, action: "farm.assignment.created", entityType: "user", entityId: userId, change: { after: { farmId } } });
    });
  }

  async permissionsForRole(principal: SessionPrincipalData, roleId: string): Promise<readonly string[]> {
    return this.database.runInTenantTransaction(principal.tenantId, async (db) => (await db.select({ code: rolePermissions.permissionCode }).from(rolePermissions).where(and(eq(rolePermissions.tenantId, principal.tenantId), eq(rolePermissions.roleId, roleId)))).map((item) => item.code));
  }
}
