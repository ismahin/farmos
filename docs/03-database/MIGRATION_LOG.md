# Database Migration Log

## 0000_m03_foundation.sql — 2026-09-22

**Status:** Applied successfully from an empty PostgreSQL 17 database by automated Testcontainers tests.

Creates the M03 schemas `platform`, `identity`, `organization`, `farm`, `audit`, and `integration`; the tenant, entitlement, identity/RBAC/session, organization/legal-entity, farm/farm-assignment, audit, idempotency, and outbox tables; foundation permissions; tenant-aware composite constraints; supporting indexes; login/session resolver functions; immutable audit protection; and tenant RLS policies.

The migration creates the `farmos_runtime` group role as `NOLOGIN`, `NOBYPASSRLS`, enables and forces RLS on tenant-owned tables, and grants only M03 runtime privileges. Migration/DDL credentials remain separate from API runtime credentials.

Production schema push is prohibited. The workflow is Drizzle schema → generated SQL → review → version control → migrate. PostgreSQL-specific reviewed SQL supplies RLS, role, function, trigger, and composite-integrity behavior.

Rollback is forward-fix only for this initial foundation once data exists; dropping these schemas destroys tenant data and is not an operational rollback.
