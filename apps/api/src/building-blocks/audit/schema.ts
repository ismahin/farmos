import { index, jsonb, pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const auditSchema = pgSchema("audit");
export interface AuditChange { readonly before?: Record<string, unknown>; readonly after?: Record<string, unknown> }

export const auditRecords = auditSchema.table("audit_records", {
  id: uuid("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  actorId: uuid("actor_id"),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id"),
  occurredAt: timestamp("occurred_at", { withTimezone: true, mode: "date" }).notNull(),
  correlationId: text("correlation_id").notNull(),
  source: text("source").notNull(),
  change: jsonb("change").$type<AuditChange>(),
}, (table) => [
  index("audit_records_tenant_time_idx").on(table.tenantId, table.occurredAt),
  index("audit_records_correlation_idx").on(table.tenantId, table.correlationId),
]);
