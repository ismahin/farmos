import { bigint, index, pgSchema, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const farmSchema = pgSchema("farm");

export const farms = farmSchema.table("farms", {
  id: uuid("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  organizationId: uuid("organization_id").notNull(),
  code: text("code").notNull(),
  displayName: text("display_name").notNull(),
  timezone: text("timezone").notNull(),
  status: text("status", { enum: ["ACTIVE", "INACTIVE"] }).notNull().default("ACTIVE"),
  version: bigint("version", { mode: "number" }).notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  createdBy: uuid("created_by").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
  updatedBy: uuid("updated_by").notNull(),
}, (table) => [
  unique("farms_tenant_id_uq").on(table.tenantId, table.id),
  unique("farms_tenant_code_uq").on(table.tenantId, table.code),
  index("farms_tenant_status_id_idx").on(table.tenantId, table.status, table.id),
]);
