import { Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { AuditService } from "../../../building-blocks/audit/audit.service.js";
import { DatabaseService } from "../../../building-blocks/database/database.service.js";
import { OutboxService } from "../../../building-blocks/events/outbox.service.js";
import { AppError } from "../../../building-blocks/http/app-error.js";
import { newId } from "../../../building-blocks/ids/uuid.js";
import { IdempotencyService } from "../../../building-blocks/idempotency/idempotency.service.js";
import type { SessionPrincipalData } from "../../identity/application/auth.service.js";
import { legalEntities, organizations } from "../infrastructure/schema.js";

export interface OrganizationView extends Record<string, unknown> { id: string; code: string; displayName: string; status: string; version: number; createdAt: string; updatedAt: string }

@Injectable()
export class OrganizationService {
  constructor(private readonly database: DatabaseService, private readonly idempotency: IdempotencyService, private readonly audit: AuditService, private readonly outbox: OutboxService) {}

  create(principal: SessionPrincipalData, key: string, input: { code: string; displayName: string; legalName: string; baseCurrency: string }): Promise<OrganizationView> {
    return this.idempotency.execute({ tenantId: principal.tenantId, principalId: principal.userId, operation: "organization.create", key, payload: input }, async (db) => {
      const now = new Date(); const id = newId();
      const [created] = await db.insert(organizations).values({ id, tenantId: principal.tenantId, code: input.code, displayName: input.displayName.trim(), status: "ACTIVE", version: 1, createdAt: now, createdBy: principal.userId, updatedAt: now, updatedBy: principal.userId }).returning();
      if (!created) throw new AppError(500, "INTERNAL_FAILURE", "Organization creation failed.");
      await db.insert(legalEntities).values({ id: newId(), tenantId: principal.tenantId, organizationId: id, code: input.code, legalName: input.legalName.trim(), baseCurrency: input.baseCurrency, createdAt: now });
      await this.audit.append(db, { tenantId: principal.tenantId, actorId: principal.userId, action: "organization.created", entityType: "organization", entityId: id, change: { after: { code: input.code, displayName: input.displayName } } });
      await this.outbox.append(db, { tenantId: principal.tenantId, eventType: "farmos.organization.organization-created.v1", subjectType: "organization", subjectId: id, payload: { organizationId: id, code: input.code } });
      return this.view(created);
    });
  }

  async get(principal: SessionPrincipalData, id: string): Promise<OrganizationView> {
    return this.database.runInTenantTransaction(principal.tenantId, async (db) => {
      const [item] = await db.select().from(organizations).where(and(eq(organizations.tenantId, principal.tenantId), eq(organizations.id, id))).limit(1);
      if (!item) throw new AppError(404, "RESOURCE_NOT_FOUND", "Organization not found.");
      return this.view(item);
    });
  }

  async update(principal: SessionPrincipalData, id: string, expectedVersion: number, displayName: string): Promise<OrganizationView> {
    return this.database.runInTenantTransaction(principal.tenantId, async (db) => {
      const [before] = await db.select().from(organizations).where(and(eq(organizations.tenantId, principal.tenantId), eq(organizations.id, id))).limit(1);
      if (!before) throw new AppError(404, "RESOURCE_NOT_FOUND", "Organization not found.");
      const [updated] = await db.update(organizations).set({ displayName: displayName.trim(), version: expectedVersion + 1, updatedAt: new Date(), updatedBy: principal.userId }).where(and(eq(organizations.tenantId, principal.tenantId), eq(organizations.id, id), eq(organizations.version, expectedVersion))).returning();
      if (!updated) throw new AppError(412, "CONCURRENCY_CONFLICT", "The organization changed after it was read.");
      await this.audit.append(db, { tenantId: principal.tenantId, actorId: principal.userId, action: "organization.updated", entityType: "organization", entityId: id, change: { before: { displayName: before.displayName, version: before.version }, after: { displayName: updated.displayName, version: updated.version } } });
      return this.view(updated);
    });
  }

  private view(row: typeof organizations.$inferSelect): OrganizationView { return { id: row.id, code: row.code, displayName: row.displayName, status: row.status, version: row.version, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() }; }
}
