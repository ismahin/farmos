# Multitenancy Architecture

> **Status: Authoritative (M02).**

## Model

`Tenant` is the commercial and isolation boundary. A tenant contains Organizations; Organizations contain LegalEntities/BusinessUnits and operate Farms. Users are global identity subjects only where required for login, but memberships, roles, assignments, sessions, and all ERP records are tenant scoped. FarmAssignment narrows effective access; it never enlarges permissions.

## Trusted-context pipeline

1. Authentication validates session/token and resolves subject plus tenant membership server-side.
2. Middleware creates immutable `TenantContext(tenantId, subjectId, sessionId, correlationId)`; tenant selection is allowed only from memberships represented in a freshly validated session/grant.
3. Endpoints ignore/reject an authoritative `tenantId` in business payloads. Route resource IDs are resolved with tenant predicates.
4. Authorization evaluates permission, entitlement, organization/farm/unit scope, resource state, and thresholds.
5. The transaction sets PostgreSQL transaction-local tenant/subject context; repositories still apply explicit tenant predicates.
6. Tenant ID flows to audit/outbox/jobs from trusted context, never from model/UI arguments.

## Database defense in depth

- Shared database, schema-per-module, shared tables with `tenant_id uuid NOT NULL` for tenant-owned data.
- Composite unique constraints and cross-tenant composite FKs include `tenant_id` (for example `(tenant_id,id)`).
- PostgreSQL RLS is enabled/forced for tenant-owned tables. Policies compare `tenant_id` with a transaction-local setting established only by the application DB role. The runtime role is not table owner and has no `BYPASSRLS`.
- A separate tightly controlled migration role owns DDL. Background workers establish tenant context per message/job. Pools must reset session state; transaction-local settings avoid tenant bleed.
- Platform-global tables are explicitly allowlisted; support/admin access uses separate audited workflows, not a magic tenant.

## Other isolation surfaces

Cache keys begin with opaque tenant ID and authorization-sensitive caches include subject/scope/version. Object keys use tenant prefixes with signed, short-lived access. Search/vector indexes filter and authorize tenant namespaces. Queue envelopes carry trusted tenant metadata and consumers re-establish context. AI conversation/memory/retrieval never crosses tenant boundaries.

## Isolation test matrix

For every endpoint/repository/job: Tenant A cannot list/get/update/delete Tenant B data by guessed IDs; cannot create cross-tenant FK links; cannot reuse an idempotency key to cross scope; and cannot infer existence from error/timing differences. Tests also cover RLS without application predicates, pooled-connection reuse, cache keys, object paths, events, exports, future MCP and vector retrieval.
