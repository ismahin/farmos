# ADR-0003 — Shared-Database Tenant Isolation

## Status
Accepted — 2026-09-22.

## Context
Every ERP record must be isolated while early SaaS operations remain affordable and simple. Application bugs must not become the only barrier.

## Decision
Use a shared PostgreSQL database with `tenant_id` on tenant-owned rows, tenant-leading uniqueness/composite foreign keys, explicit repository predicates and forced RLS. Tenant context comes only from validated server authentication and is set transaction-locally; runtime roles cannot own/bypass RLS. Isolate cache/object/search/vector/queue/AI namespaces likewise.

## Alternatives considered
- Database per tenant: stronger physical isolation but operational/migration cost is unjustified for small tenants now.
- Schema per tenant: migration/pooling complexity and weak scaling ergonomics.
- Application filtering alone: inadequate defense in depth.

## Consequences
Efficient pooled operations and uniform migrations, but every tenant table/policy/query/job requires careful tests. Enterprise physical isolation may be added later behind the same application contracts.
