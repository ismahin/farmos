import { bigint, boolean, index, pgSchema, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const identitySchema = pgSchema("identity");

export const users = identitySchema.table("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  status: text("status", { enum: ["ACTIVE", "DISABLED"] }).notNull().default("ACTIVE"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
}, (table) => [unique("users_email_uq").on(table.email), index("users_status_idx").on(table.status)]);

export const memberships = identitySchema.table("memberships", {
  id: uuid("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  userId: uuid("user_id").notNull(),
  status: text("status", { enum: ["ACTIVE", "SUSPENDED"] }).notNull().default("ACTIVE"),
  isTenantOwner: boolean("is_tenant_owner").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
}, (table) => [
  unique("memberships_tenant_id_uq").on(table.tenantId, table.id),
  unique("memberships_tenant_user_uq").on(table.tenantId, table.userId),
  unique("memberships_user_uq").on(table.userId),
  index("memberships_user_idx").on(table.userId),
]);

export const permissions = identitySchema.table("permissions", {
  code: text("code").primaryKey(),
  description: text("description").notNull(),
});

export const roles = identitySchema.table("roles", {
  id: uuid("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  code: text("code").notNull(),
  displayName: text("display_name").notNull(),
  system: boolean("system").notNull().default(false),
  version: bigint("version", { mode: "number" }).notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
}, (table) => [
  unique("roles_tenant_id_uq").on(table.tenantId, table.id),
  unique("roles_tenant_code_uq").on(table.tenantId, table.code),
]);

export const rolePermissions = identitySchema.table("role_permissions", {
  tenantId: uuid("tenant_id").notNull(),
  roleId: uuid("role_id").notNull(),
  permissionCode: text("permission_code").notNull(),
}, (table) => [unique("role_permissions_uq").on(table.tenantId, table.roleId, table.permissionCode)]);

export const userRoles = identitySchema.table("user_roles", {
  id: uuid("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  userId: uuid("user_id").notNull(),
  roleId: uuid("role_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
}, (table) => [
  unique("user_roles_tenant_id_uq").on(table.tenantId, table.id),
  unique("user_roles_assignment_uq").on(table.tenantId, table.userId, table.roleId),
  index("user_roles_user_idx").on(table.tenantId, table.userId),
]);

export const farmAssignments = identitySchema.table("farm_assignments", {
  id: uuid("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  userId: uuid("user_id").notNull(),
  farmId: uuid("farm_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
}, (table) => [
  unique("farm_assignments_tenant_id_uq").on(table.tenantId, table.id),
  unique("farm_assignments_user_farm_uq").on(table.tenantId, table.userId, table.farmId),
  index("farm_assignments_user_idx").on(table.tenantId, table.userId),
]);

export const sessions = identitySchema.table("sessions", {
  id: uuid("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  userId: uuid("user_id").notNull(),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true, mode: "date" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
}, (table) => [
  unique("sessions_token_hash_uq").on(table.tokenHash),
  unique("sessions_tenant_id_uq").on(table.tenantId, table.id),
  index("sessions_user_idx").on(table.tenantId, table.userId),
]);
