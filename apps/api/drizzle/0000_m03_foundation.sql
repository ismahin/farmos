DO $$ BEGIN
  CREATE ROLE farmos_runtime NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS platform;
CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS organization;
CREATE SCHEMA IF NOT EXISTS farm;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS integration;
--> statement-breakpoint
CREATE TABLE platform.tenants (
  id uuid PRIMARY KEY,
  display_name text NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','SUSPENDED')),
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  CONSTRAINT tenants_id_scope_uq UNIQUE (id)
);
CREATE INDEX tenants_status_idx ON platform.tenants(status);
--> statement-breakpoint
CREATE TABLE platform.entitlements (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES platform.tenants(id),
  capability text NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE')),
  created_at timestamptz NOT NULL,
  CONSTRAINT entitlements_tenant_id_uq UNIQUE (tenant_id,id),
  CONSTRAINT entitlements_tenant_capability_uq UNIQUE (tenant_id,capability)
);
--> statement-breakpoint
CREATE TABLE identity.users (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  display_name text NOT NULL,
  password_hash text NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','DISABLED')),
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  CONSTRAINT users_email_uq UNIQUE (email),
  CONSTRAINT users_email_normalized CHECK (email = lower(email))
);
CREATE INDEX users_status_idx ON identity.users(status);
--> statement-breakpoint
CREATE TABLE identity.memberships (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES platform.tenants(id),
  user_id uuid NOT NULL REFERENCES identity.users(id),
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','SUSPENDED')),
  is_tenant_owner boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL,
  CONSTRAINT memberships_tenant_id_uq UNIQUE (tenant_id,id),
  CONSTRAINT memberships_tenant_user_uq UNIQUE (tenant_id,user_id),
  CONSTRAINT memberships_user_uq UNIQUE (user_id)
);
CREATE INDEX memberships_user_idx ON identity.memberships(user_id);
--> statement-breakpoint
CREATE TABLE identity.permissions (code text PRIMARY KEY, description text NOT NULL);
--> statement-breakpoint
CREATE TABLE identity.roles (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES platform.tenants(id),
  code text NOT NULL,
  display_name text NOT NULL,
  system boolean NOT NULL DEFAULT false,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL,
  CONSTRAINT roles_tenant_id_uq UNIQUE (tenant_id,id),
  CONSTRAINT roles_tenant_code_uq UNIQUE (tenant_id,code)
);
--> statement-breakpoint
CREATE TABLE identity.role_permissions (
  tenant_id uuid NOT NULL,
  role_id uuid NOT NULL,
  permission_code text NOT NULL REFERENCES identity.permissions(code),
  CONSTRAINT role_permissions_uq UNIQUE (tenant_id,role_id,permission_code),
  CONSTRAINT role_permissions_role_fk FOREIGN KEY (tenant_id,role_id) REFERENCES identity.roles(tenant_id,id)
);
--> statement-breakpoint
CREATE TABLE identity.user_roles (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role_id uuid NOT NULL,
  created_at timestamptz NOT NULL,
  CONSTRAINT user_roles_tenant_id_uq UNIQUE (tenant_id,id),
  CONSTRAINT user_roles_assignment_uq UNIQUE (tenant_id,user_id,role_id),
  CONSTRAINT user_roles_membership_fk FOREIGN KEY (tenant_id,user_id) REFERENCES identity.memberships(tenant_id,user_id),
  CONSTRAINT user_roles_role_fk FOREIGN KEY (tenant_id,role_id) REFERENCES identity.roles(tenant_id,id)
);
CREATE INDEX user_roles_user_idx ON identity.user_roles(tenant_id,user_id);
--> statement-breakpoint
CREATE TABLE organization.organizations (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES platform.tenants(id),
  code text NOT NULL,
  display_name text NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE')),
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL,
  created_by uuid NOT NULL REFERENCES identity.users(id),
  updated_at timestamptz NOT NULL,
  updated_by uuid NOT NULL REFERENCES identity.users(id),
  CONSTRAINT organizations_tenant_id_uq UNIQUE (tenant_id,id),
  CONSTRAINT organizations_tenant_code_uq UNIQUE (tenant_id,code)
);
CREATE INDEX organizations_tenant_status_idx ON organization.organizations(tenant_id,status);
--> statement-breakpoint
CREATE TABLE organization.legal_entities (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  organization_id uuid NOT NULL,
  code text NOT NULL,
  legal_name text NOT NULL,
  base_currency text NOT NULL CHECK (base_currency ~ '^[A-Z]{3}$'),
  created_at timestamptz NOT NULL,
  CONSTRAINT legal_entities_tenant_id_uq UNIQUE (tenant_id,id),
  CONSTRAINT legal_entities_tenant_code_uq UNIQUE (tenant_id,code),
  CONSTRAINT legal_entities_org_fk FOREIGN KEY (tenant_id,organization_id) REFERENCES organization.organizations(tenant_id,id)
);
--> statement-breakpoint
CREATE TABLE farm.farms (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  organization_id uuid NOT NULL,
  code text NOT NULL,
  display_name text NOT NULL,
  timezone text NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE')),
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL,
  created_by uuid NOT NULL REFERENCES identity.users(id),
  updated_at timestamptz NOT NULL,
  updated_by uuid NOT NULL REFERENCES identity.users(id),
  CONSTRAINT farms_tenant_id_uq UNIQUE (tenant_id,id),
  CONSTRAINT farms_tenant_code_uq UNIQUE (tenant_id,code),
  CONSTRAINT farms_organization_fk FOREIGN KEY (tenant_id,organization_id) REFERENCES organization.organizations(tenant_id,id)
);
CREATE INDEX farms_tenant_status_id_idx ON farm.farms(tenant_id,status,id);
--> statement-breakpoint
CREATE TABLE identity.farm_assignments (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  user_id uuid NOT NULL,
  farm_id uuid NOT NULL,
  created_at timestamptz NOT NULL,
  CONSTRAINT farm_assignments_tenant_id_uq UNIQUE (tenant_id,id),
  CONSTRAINT farm_assignments_user_farm_uq UNIQUE (tenant_id,user_id,farm_id),
  CONSTRAINT farm_assignments_membership_fk FOREIGN KEY (tenant_id,user_id) REFERENCES identity.memberships(tenant_id,user_id),
  CONSTRAINT farm_assignments_farm_fk FOREIGN KEY (tenant_id,farm_id) REFERENCES farm.farms(tenant_id,id)
);
CREATE INDEX farm_assignments_user_idx ON identity.farm_assignments(tenant_id,user_id);
--> statement-breakpoint
CREATE TABLE identity.sessions (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  user_id uuid NOT NULL,
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL,
  CONSTRAINT sessions_tenant_id_uq UNIQUE (tenant_id,id),
  CONSTRAINT sessions_token_hash_uq UNIQUE (token_hash),
  CONSTRAINT sessions_membership_fk FOREIGN KEY (tenant_id,user_id) REFERENCES identity.memberships(tenant_id,user_id)
);
CREATE INDEX sessions_user_idx ON identity.sessions(tenant_id,user_id);
--> statement-breakpoint
CREATE TABLE audit.audit_records (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES platform.tenants(id),
  actor_id uuid REFERENCES identity.users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  occurred_at timestamptz NOT NULL,
  correlation_id text NOT NULL,
  source text NOT NULL,
  change jsonb
);
CREATE INDEX audit_records_tenant_time_idx ON audit.audit_records(tenant_id,occurred_at);
CREATE INDEX audit_records_correlation_idx ON audit.audit_records(tenant_id,correlation_id);
--> statement-breakpoint
CREATE TABLE integration.idempotency_records (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  principal_id uuid NOT NULL,
  operation text NOT NULL,
  key text NOT NULL,
  fingerprint text NOT NULL,
  status text NOT NULL CHECK (status IN ('IN_PROGRESS','COMPLETED')),
  result jsonb,
  created_at timestamptz NOT NULL,
  completed_at timestamptz,
  CONSTRAINT idempotency_scope_key_uq UNIQUE (tenant_id,principal_id,operation,key)
);
--> statement-breakpoint
CREATE TABLE integration.outbox_messages (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  event_type text NOT NULL,
  schema_version text NOT NULL,
  subject_type text NOT NULL,
  subject_id uuid NOT NULL,
  correlation_id text NOT NULL,
  causation_id text,
  payload jsonb NOT NULL,
  occurred_at timestamptz NOT NULL,
  published_at timestamptz,
  CONSTRAINT outbox_event_id_uq UNIQUE(id)
);
CREATE INDEX outbox_pending_idx ON integration.outbox_messages(occurred_at) WHERE published_at IS NULL;
--> statement-breakpoint
INSERT INTO identity.permissions(code,description) VALUES
 ('organization.read','Read organizations'),('organization.manage','Create and update organizations'),
 ('farm.read','Read farms'),('farm.create','Create farms'),('farm.update','Update farms'),
 ('users.read','Read tenant users'),('users.manage','Create users and assignments'),
 ('roles.read','Read roles'),('roles.manage','Assign roles')
ON CONFLICT DO NOTHING;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION identity.resolve_login(p_email text)
RETURNS TABLE(user_id uuid,password_hash text,user_status text,tenant_id uuid,membership_status text,is_tenant_owner boolean,tenant_status text)
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = pg_catalog, identity, platform AS $$
 SELECT u.id,u.password_hash,u.status,m.tenant_id,m.status,m.is_tenant_owner,t.status
 FROM identity.users u JOIN identity.memberships m ON m.user_id=u.id JOIN platform.tenants t ON t.id=m.tenant_id
 WHERE u.email=lower(p_email) LIMIT 1
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION identity.resolve_session(p_token_hash text)
RETURNS TABLE(session_id uuid,user_id uuid,tenant_id uuid,user_status text,membership_status text,tenant_status text,is_tenant_owner boolean,permission_code text)
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = pg_catalog, identity, platform AS $$
 SELECT s.id,u.id,s.tenant_id,u.status,m.status,t.status,m.is_tenant_owner,rp.permission_code
 FROM identity.sessions s
 JOIN identity.users u ON u.id=s.user_id
 JOIN identity.memberships m ON m.user_id=u.id AND m.tenant_id=s.tenant_id
 JOIN platform.tenants t ON t.id=s.tenant_id
 LEFT JOIN identity.user_roles ur ON ur.user_id=u.id AND ur.tenant_id=s.tenant_id
 LEFT JOIN identity.role_permissions rp ON rp.role_id=ur.role_id AND rp.tenant_id=s.tenant_id
 WHERE s.token_hash=p_token_hash AND s.revoked_at IS NULL AND s.expires_at>now()
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION audit.reject_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'audit records are append-only'; END $$;
CREATE TRIGGER audit_records_immutable BEFORE UPDATE OR DELETE ON audit.audit_records FOR EACH ROW EXECUTE FUNCTION audit.reject_mutation();
--> statement-breakpoint
ALTER TABLE platform.entitlements ENABLE ROW LEVEL SECURITY; ALTER TABLE platform.entitlements FORCE ROW LEVEL SECURITY;
ALTER TABLE identity.memberships ENABLE ROW LEVEL SECURITY; ALTER TABLE identity.memberships FORCE ROW LEVEL SECURITY;
ALTER TABLE identity.roles ENABLE ROW LEVEL SECURITY; ALTER TABLE identity.roles FORCE ROW LEVEL SECURITY;
ALTER TABLE identity.role_permissions ENABLE ROW LEVEL SECURITY; ALTER TABLE identity.role_permissions FORCE ROW LEVEL SECURITY;
ALTER TABLE identity.user_roles ENABLE ROW LEVEL SECURITY; ALTER TABLE identity.user_roles FORCE ROW LEVEL SECURITY;
ALTER TABLE identity.farm_assignments ENABLE ROW LEVEL SECURITY; ALTER TABLE identity.farm_assignments FORCE ROW LEVEL SECURITY;
ALTER TABLE identity.sessions ENABLE ROW LEVEL SECURITY; ALTER TABLE identity.sessions FORCE ROW LEVEL SECURITY;
ALTER TABLE organization.organizations ENABLE ROW LEVEL SECURITY; ALTER TABLE organization.organizations FORCE ROW LEVEL SECURITY;
ALTER TABLE organization.legal_entities ENABLE ROW LEVEL SECURITY; ALTER TABLE organization.legal_entities FORCE ROW LEVEL SECURITY;
ALTER TABLE farm.farms ENABLE ROW LEVEL SECURITY; ALTER TABLE farm.farms FORCE ROW LEVEL SECURITY;
ALTER TABLE audit.audit_records ENABLE ROW LEVEL SECURITY; ALTER TABLE audit.audit_records FORCE ROW LEVEL SECURITY;
ALTER TABLE integration.idempotency_records ENABLE ROW LEVEL SECURITY; ALTER TABLE integration.idempotency_records FORCE ROW LEVEL SECURITY;
ALTER TABLE integration.outbox_messages ENABLE ROW LEVEL SECURITY; ALTER TABLE integration.outbox_messages FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
DO $$ DECLARE tbl text; sch text; BEGIN
 FOR sch,tbl IN SELECT * FROM (VALUES
 ('platform','entitlements'),('identity','memberships'),('identity','roles'),('identity','role_permissions'),
 ('identity','user_roles'),('identity','farm_assignments'),('identity','sessions'),('organization','organizations'),
 ('organization','legal_entities'),('farm','farms'),('audit','audit_records'),('integration','idempotency_records'),
 ('integration','outbox_messages')) AS x(s,t)
 LOOP EXECUTE format('CREATE POLICY tenant_isolation ON %I.%I FOR ALL TO farmos_runtime USING (tenant_id = NULLIF(current_setting(''app.tenant_id'', true), '''')::uuid) WITH CHECK (tenant_id = NULLIF(current_setting(''app.tenant_id'', true), '''')::uuid)',sch,tbl); END LOOP;
END $$;
--> statement-breakpoint
GRANT USAGE ON SCHEMA platform,identity,organization,farm,audit,integration TO farmos_runtime;
GRANT SELECT,INSERT,UPDATE ON platform.tenants,identity.users TO farmos_runtime;
GRANT SELECT ON identity.permissions TO farmos_runtime;
GRANT SELECT,INSERT,UPDATE,DELETE ON platform.entitlements,identity.memberships,identity.roles,identity.role_permissions,identity.user_roles,identity.farm_assignments,identity.sessions,organization.organizations,organization.legal_entities,farm.farms,integration.idempotency_records,integration.outbox_messages TO farmos_runtime;
GRANT SELECT,INSERT ON audit.audit_records TO farmos_runtime;
GRANT EXECUTE ON FUNCTION identity.resolve_login(text),identity.resolve_session(text) TO farmos_runtime;
