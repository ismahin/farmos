# PostgreSQL Schema and Modeling Rules

> **Status: Authoritative (M02, amended by M02A).** M03 creates migrations; M02/M02A create none.

- Use lowercase `snake_case`, plural table names, explicit module schemas (`platform`, `identity`, `organization`, `farm`, `catalog`, `production`, `poultry`, `inventory`, `procurement`, `sales`, `finance`, `workflow`, `traceability`, `audit`, `integration`).
- UUIDv7 primary keys (`uuid`); separate human-readable codes. Every tenant-owned row has `tenant_id uuid NOT NULL` and normally `UNIQUE(tenant_id,id)` to support composite FKs.
- Use composite FKs including tenant ID for tenant-owned relationships. Define delete behavior explicitly; financial, stock, event, trace and audit history is never cascade-deleted.
- Mutable aggregates have `version bigint NOT NULL` for optimistic concurrency plus `created_at/by`, `updated_at/by`; lifecycle status uses check constraints or mapped controlled codes.
- Store instants as `timestamptz` UTC; local business dates as `date`; keep IANA farm timezone and source offset/timezone metadata where occurrence meaning requires it.
- Money/quantity use `numeric` with domain-appropriate precision/scale plus currency/UOM FK. No `real/double precision` for authoritative arithmetic. Counts are integer/bigint where fractional values are invalid.
- Typed relational columns hold core facts. JSONB is allowed for controlled metadata, external payload snapshots and versioned optional configuration with schema validation; no EAV for core facts.
- Use `citext` only deliberately; normalize business codes consistently. All uniqueness is explicit and tenant scoped unless truly platform global.
- Soft-delete only mutable master data where history/reference requires it (`inactive_at/status` preferred). Ledgers/journals/audit/outbox use append, reversal or archival, never soft-delete pretending history vanished.
- Index every FK/query predicate intentionally. Tenant-leading composite indexes support isolation; partial indexes support active/open/outbox rows. Review selectivity before adding duplicate indexes.
- RLS is forced on tenant tables; runtime roles cannot own/bypass it. Migration and runtime roles are distinct. Set tenant context transaction-locally and test pool reuse.
- Migrations are forward, ordered, reviewed and deployment-compatible; destructive/backfill changes use expand-migrate-contract with rollback/restore strategy. No automatic production migration on app startup.
- Constraints preserve blueprint snapshots, posted journals/stock ledger, idempotency uniqueness, balanced posting via transaction logic/tests, and outbox/inbox uniqueness.

## TypeScript persistence and migration tooling

Drizzle TypeScript schemas are the code-level relational mapping and Drizzle Kit generates SQL migrations. Generated SQL is reviewed and committed; production/CI applies migrations, never schema `push`. PostgreSQL-specific hand-authored SQL belongs in the same ordered migration when required for roles/grants, forced RLS/policies, functions, exclusion or specialized constraints/indexes, safe backfills and rollback-compatible transitions.

Module Drizzle schemas and repositories remain private to the owning module. Direct parameterized SQL is allowed only behind those repositories and must use the same `pg` connection/transaction as Drizzle. Each tenant-owned transaction establishes trusted context with transaction-local `set_config`; session-level tenant variables on pooled connections are forbidden.
