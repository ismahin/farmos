import { index, pgSchema, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const platformSchema = pgSchema("platform");

export const tenants = platformSchema.table("tenants", {
  id: uuid("id").primaryKey(),
  displayName: text("display_name").notNull(),
  status: text("status", { enum: ["ACTIVE", "SUSPENDED"] }).notNull().default("ACTIVE"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
}, (table) => [unique("tenants_id_scope_uq").on(table.id), index("tenants_status_idx").on(table.status)]);

export const entitlements = platformSchema.table("entitlements", {
  id: uuid("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  capability: text("capability").notNull(),
  status: text("status", { enum: ["ACTIVE", "INACTIVE"] }).notNull().default("ACTIVE"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
}, (table) => [
  unique("entitlements_tenant_capability_uq").on(table.tenantId, table.capability),
  unique("entitlements_tenant_id_uq").on(table.tenantId, table.id),
]);
