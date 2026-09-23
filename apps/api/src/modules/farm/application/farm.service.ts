import { Injectable } from "@nestjs/common";
import { and, asc, eq, gt, inArray } from "drizzle-orm";
import { AuditService } from "../../../building-blocks/audit/audit.service.js";
import { DatabaseService, type Database } from "../../../building-blocks/database/database.service.js";
import { OutboxService } from "../../../building-blocks/events/outbox.service.js";
import { AppError } from "../../../building-blocks/http/app-error.js";
import { newId } from "../../../building-blocks/ids/uuid.js";
import { IdempotencyService } from "../../../building-blocks/idempotency/idempotency.service.js";
import type { SessionPrincipalData } from "../../identity/application/auth.service.js";
import { farmAssignments } from "../../identity/persistence.js";
import { organizations } from "../../organization/persistence.js";
import { farms } from "../infrastructure/schema.js";

export interface FarmView extends Record<string, unknown> { id: string; organizationId: string; code: string; displayName: string; timezone: string; status: string; version: number; createdAt: string; updatedAt: string }

@Injectable()
export class FarmService {
  constructor(private readonly database: DatabaseService, private readonly idempotency: IdempotencyService, private readonly audit: AuditService, private readonly outbox: OutboxService) {}

  create(principal: SessionPrincipalData, key: string, input: { organizationId: string; code: string; displayName: string; timezone: string }): Promise<FarmView> {
    this.assertTimezone(input.timezone);
    return this.idempotency.execute({ tenantId: principal.tenantId, principalId: principal.userId, operation: "farm.create", key, payload: input }, async (db) => {
      const [organization] = await db.select({ id: organizations.id }).from(organizations).where(and(eq(organizations.tenantId, principal.tenantId), eq(organizations.id, input.organizationId))).limit(1);
      if (!organization) throw new AppError(404, "RESOURCE_NOT_FOUND", "Organization not found.");
      const now = new Date(); const id = newId();
      const [created] = await db.insert(farms).values({ id, tenantId: principal.tenantId, organizationId: input.organizationId, code: input.code, displayName: input.displayName.trim(), timezone: input.timezone, status: "ACTIVE", version: 1, createdAt: now, createdBy: principal.userId, updatedAt: now, updatedBy: principal.userId }).returning();
      if (!created) throw new AppError(500, "INTERNAL_FAILURE", "Farm creation failed.");
      await this.audit.append(db, { tenantId: principal.tenantId, actorId: principal.userId, action: "farm.created", entityType: "farm", entityId: id, change: { after: { code: input.code, displayName: input.displayName, organizationId: input.organizationId } } });
      await this.outbox.append(db, { tenantId: principal.tenantId, eventType: "farmos.farm.farm-created.v1", subjectType: "farm", subjectId: id, payload: { farmId: id, organizationId: input.organizationId, code: input.code } });
      return this.view(created);
    });
  }

  async get(principal: SessionPrincipalData, id: string): Promise<FarmView> {
    return this.database.runInTenantTransaction(principal.tenantId, async (db) => {
      const [item] = await db.select().from(farms).where(and(eq(farms.tenantId, principal.tenantId), eq(farms.id, id))).limit(1);
      if (!item) throw new AppError(404, "RESOURCE_NOT_FOUND", "Farm not found.");
      await this.assertAccess(db, principal, id);
      return this.view(item);
    });
  }

  async list(principal: SessionPrincipalData, pageSize: number, cursor?: string): Promise<{ items: FarmView[]; page: { nextCursor: string | null; hasMore: boolean } }> {
    return this.database.runInTenantTransaction(principal.tenantId, async (db) => {
      const conditions = [eq(farms.tenantId, principal.tenantId)];
      if (cursor) conditions.push(gt(farms.id, cursor));
      if (!principal.isTenantOwner) {
        const assignments = await db.select({ farmId: farmAssignments.farmId }).from(farmAssignments).where(and(eq(farmAssignments.tenantId, principal.tenantId), eq(farmAssignments.userId, principal.userId)));
        const ids = assignments.map((item) => item.farmId);
        if (ids.length === 0) return { items: [], page: { nextCursor: null, hasMore: false } };
        conditions.push(inArray(farms.id, ids));
      }
      const rows = await db.select().from(farms).where(and(...conditions)).orderBy(asc(farms.id)).limit(pageSize + 1);
      const hasMore = rows.length > pageSize; const visible = rows.slice(0, pageSize);
      return { items: visible.map((row) => this.view(row)), page: { nextCursor: hasMore ? visible.at(-1)?.id ?? null : null, hasMore } };
    });
  }

  async update(principal: SessionPrincipalData, id: string, expectedVersion: number, input: { displayName: string; timezone: string }): Promise<FarmView> {
    this.assertTimezone(input.timezone);
    return this.database.runInTenantTransaction(principal.tenantId, async (db) => {
      await this.assertAccess(db, principal, id);
      const [before] = await db.select().from(farms).where(and(eq(farms.tenantId, principal.tenantId), eq(farms.id, id))).limit(1);
      if (!before) throw new AppError(404, "RESOURCE_NOT_FOUND", "Farm not found.");
      const [updated] = await db.update(farms).set({ displayName: input.displayName.trim(), timezone: input.timezone, version: expectedVersion + 1, updatedAt: new Date(), updatedBy: principal.userId }).where(and(eq(farms.tenantId, principal.tenantId), eq(farms.id, id), eq(farms.version, expectedVersion))).returning();
      if (!updated) throw new AppError(412, "CONCURRENCY_CONFLICT", "The farm changed after it was read.");
      await this.audit.append(db, { tenantId: principal.tenantId, actorId: principal.userId, action: "farm.updated", entityType: "farm", entityId: id, change: { before: { displayName: before.displayName, timezone: before.timezone, version: before.version }, after: { displayName: updated.displayName, timezone: updated.timezone, version: updated.version } } });
      return this.view(updated);
    });
  }

  private async assertAccess(db: Database, principal: SessionPrincipalData, farmId: string): Promise<void> {
    if (principal.isTenantOwner) return;
    const [assignment] = await db.select({ id: farmAssignments.id }).from(farmAssignments).where(and(eq(farmAssignments.tenantId, principal.tenantId), eq(farmAssignments.userId, principal.userId), eq(farmAssignments.farmId, farmId))).limit(1);
    if (!assignment) throw new AppError(403, "ACTION_FORBIDDEN", "The farm is outside the assigned scope.");
  }
  private assertTimezone(timezone: string): void { try { new Intl.DateTimeFormat("en", { timeZone: timezone }).format(); } catch { throw new AppError(422, "BUSINESS_RULE_VIOLATION", "The farm timezone is not a valid IANA timezone."); } }
  private view(row: typeof farms.$inferSelect): FarmView { return { id: row.id, organizationId: row.organizationId, code: row.code, displayName: row.displayName, timezone: row.timezone, status: row.status, version: row.version, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() }; }
}
