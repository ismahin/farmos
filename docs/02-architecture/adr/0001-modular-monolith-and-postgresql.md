# ADR-0001 — Modular Monolith First; PostgreSQL for Transactional Truth

## Status
Accepted — inherited from the master blueprint.

## Context
FarmOS must support a large interconnected domain while avoiding premature distributed-system complexity. The blueprint explicitly recommends a well-structured modular monolith first and PostgreSQL for transactional truth.

## Decision

1. Build the application core as a modular monolith with explicit domain/module boundaries.
2. Use PostgreSQL as the primary transactional system of record for ERP truth.
3. Prevent arbitrary cross-module database access; modules should expose application/domain boundaries.
4. Use current relational state for practical queries plus append-only/immutable transaction journals where appropriate.
5. Use a transactional outbox for reliable asynchronous integration when event publication is introduced.
6. Extract services later only when measurable scaling, isolation, deployment, or operational requirements justify the cost.

## Not Decided by This ADR

- backend language/framework
- ORM/query approach
- physical PostgreSQL schema layout
- key/ID format
- exact RLS implementation strategy
- cache/broker/provider deployment choices
- hosting vendor
- service-level targets

Those decisions belong to M02 or later ADRs.

## Consequences

Positive:
- strong transactional consistency across interconnected ERP workflows
- simpler early deployment/debugging
- easier refactoring while the domain model matures
- direct support for relational integrity, JSONB flexibility, and optional RLS defense-in-depth

Trade-offs:
- module boundaries must be actively enforced to avoid a “big ball of mud”
- high-volume workloads such as IoT/analytics may later require specialized services/stores
- extracting services later requires stable contracts and event discipline

## References
- Master blueprint sections 45–49 and 66.
