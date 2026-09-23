import { bigint, index, pgSchema, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const organizationSchema = pgSchema("organization");

export const organizations = organizationSchema.table("organizations", {
  id: uuid("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  code: text("code").notNull(),
  displayName: text("display_name").notNull(),
  status: text("status", { enum: ["ACTIVE", "INACTIVE"] }).notNull().default("ACTIVE"),
  version: bigint("version", { mode: "number" }).notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  createdBy: uuid("created_by").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
  updatedBy: uuid("updated_by").notNull(),
}, (table) => [
  unique("organizations_tenant_id_uq").on(table.tenantId, table.id),
  unique("organizations_tenant_code_uq").on(table.tenantId, table.code),
  index("organizations_tenant_status_idx").on(table.tenantId, table.status),
]);

export const legalEntities = organizationSchema.table("legal_entities", {
  id: uuid("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  organizationId: uuid("organization_id").notNull(),
  code: text("code").notNull(),
  legalName: text("legal_name").notNull(),
  baseCurrency: text("base_currency").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
}, (table) => [
  unique("legal_entities_tenant_id_uq").on(table.tenantId, table.id),
  unique("legal_entities_tenant_code_uq").on(table.tenantId, table.code),
]);
