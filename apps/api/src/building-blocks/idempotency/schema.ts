import { jsonb, pgSchema, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const integrationSchema = pgSchema("integration");

export const idempotencyRecords = integrationSchema.table("idempotency_records", {
  id: uuid("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  principalId: uuid("principal_id").notNull(),
  operation: text("operation").notNull(),
  key: text("key").notNull(),
  fingerprint: text("fingerprint").notNull(),
  status: text("status", { enum: ["IN_PROGRESS", "COMPLETED"] }).notNull(),
  result: jsonb("result").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true, mode: "date" }),
}, (table) => [unique("idempotency_scope_key_uq").on(table.tenantId, table.principalId, table.operation, table.key)]);

export const outboxMessages = integrationSchema.table("outbox_messages", {
  id: uuid("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  eventType: text("event_type").notNull(),
  schemaVersion: text("schema_version").notNull(),
  subjectType: text("subject_type").notNull(),
  subjectId: uuid("subject_id").notNull(),
  correlationId: text("correlation_id").notNull(),
  causationId: text("causation_id"),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true, mode: "date" }).notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true, mode: "date" }),
}, (table) => [unique("outbox_event_id_uq").on(table.id)]);
