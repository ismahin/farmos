# Architecture Decision Records

Use ADRs to preserve significant decisions that future agents must not accidentally reverse.

## Status Values

- Proposed
- Accepted
- Superseded
- Rejected

## When an ADR Is Required

Create an ADR for major changes to runtime/framework, persistence, tenancy, module boundaries, core domain models, inventory/accounting approaches, workflow/approval design, event/versioning strategy, offline/idempotency design, AI/MCP security, or major infrastructure dependencies.

Do not create an ADR for ordinary component styling, localized refactors, or implementation details that do not materially constrain future architecture.

## Index

- `0001-modular-monolith-and-postgresql.md` — Accepted; inherited from master blueprint.

Use `0000-template.md` for new records.

## M02/M02A ADRs

- `0001-modular-monolith-and-postgresql.md` — modular monolith and PostgreSQL truth.
- `0002-aspnet-core-backend.md` — **Superseded** by ADR-0013; retained as historical context.
- `0003-tenant-isolation.md` — shared database plus trusted context, constraints and RLS.
- `0004-production-cycle-core.md` — common ProductionCycle and immutable blueprint snapshot.
- `0005-shared-item-uom.md` — shared Item/UOM catalog.
- `0006-inventory-ledger.md` — append-only stock ledger.
- `0007-operational-event-journal.md` — pragmatic operational history.
- `0008-transactional-outbox.md` — at-least-once eventing with idempotent consumers.
- `0009-uuidv7-identifiers.md` — UUIDv7 technical identifiers.
- `0010-rest-openapi.md` — REST/OpenAPI contract.
- `0011-ai-trust-boundary.md` — controlled FarmOS-owned tool boundary.
- `0012-workflow-approvals.md` — generic versioned approval workflow.
- `0013-typescript-nestjs-backend.md` — TypeScript/Node.js/NestJS with Drizzle/`pg`; supersedes ADR-0002.
