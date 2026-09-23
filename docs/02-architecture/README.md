# Architecture Documentation

> **Status: Authoritative index (M02, amended by M02A).**

Read `SYSTEM_ARCHITECTURE.md`, `BOUNDED_CONTEXTS.md`, `MODULE_DEPENDENCIES.md`, and `DOMAIN_MODEL.md` first. Security/tenancy, inventory/production/finance/traceability, workflow/audit/idempotency/eventing, and M01 integration reviews are separate focused documents in this directory.

Durable decisions are indexed in `adr/README.md`. ADR-0002 is superseded by ADR-0013; all other accepted M02 decisions remain authoritative. A later change to runtime, persistence, tenancy, module boundaries, ProductionCycle, Item/UOM, ledger, workflow, eventing, identifiers, offline/idempotency or AI security requires an ADR before implementation.

Illustrative/deferred decisions are labeled in their owning documents and must not be promoted implicitly during implementation.
