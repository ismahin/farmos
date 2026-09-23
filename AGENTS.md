# AGENTS.md — FarmOS Permanent Agent Instructions

This file is the permanent operating contract for every coding/design agent working in this repository, including Antigravity and Codex. The repository—not chat history—is the shared project memory.

## 1. Sources of Truth and Reading Order

Before starting any milestone, read these in order:

1. `docs/08-project/CURRENT_STATE.md`
2. `docs/08-project/MILESTONES.md`
3. The latest file in `docs/08-project/handoffs/`
4. The documents explicitly referenced by the assigned milestone
5. `docs/00-master/FarmOS_Master_Blueprint.md` when product/domain intent or an architectural guardrail is unclear

The master blueprint is the authoritative product/technical vision. `CURRENT_STATE.md` is the concise short-term memory. Approved ADRs record architecture decisions. API/event/MCP/database contracts become authoritative only after the milestone that formally freezes them.

## 2. Non-Negotiable Product and Architecture Guardrails

1. FarmOS is a configurable, multi-tenant Agriculture ERP SaaS for mixed-farm operations.
2. Start as a well-structured modular monolith; do not introduce microservices without an approved ADR and measurable need.
3. PostgreSQL is the primary transactional system of record. Additional stores may be introduced only for justified workloads and may not become an alternate authority for ERP truth without an ADR.
4. Separate SaaS control-plane concerns logically from customer ERP data-plane concerns.
5. Resolve authoritative tenant context from trusted server-side authentication/session context. Never trust a `TenantId` supplied by UI or AI arguments.
6. Enforce authorization in backend/application/domain services; UI visibility is not a security boundary.
7. Use database-level tenant isolation defense-in-depth where appropriate (for example PostgreSQL RLS), but do not treat it as a substitute for application authorization.
8. Business rules, state transitions, inventory arithmetic, accounting arithmetic, costing, UOM conversions, and authoritative KPI calculations are deterministic backend responsibilities.
9. `ProductionCycle` is the common time-bounded operational/economic production concept across farm verticals.
10. Inventory, finance, production, and traceability must be designed as interconnected truth systems. One physical event should propagate valid consequences once, not require duplicate manual entry.
11. Use current relational state for practical queries plus append-only/immutable ledgers or journals where appropriate. Do not event-source every aggregate.
12. Material commands require appropriate idempotency and concurrency protection.
13. Important mutations require auditability and correlation/causation context appropriate to the business risk.
14. Historical production records and blueprint references must remain reproducible/version-aware.
15. Field-facing architecture must remain compatible with poor/offline connectivity; server-side validation remains authoritative for stock, finance, and other critical commands.
16. AI never writes directly to the production database and never bypasses domain rules, tenancy, authorization, approvals, or accounting/inventory controls.
17. Hermes is the orchestration/conversation layer; FarmOS-owned APIs/tools remain the authority.
18. High-risk actions must follow configurable human-in-the-loop policies.
19. Never ask the user for data FarmOS already knows, can derive, scan, import, sense, extract, or safely default.
20. APIs/events are first-class interfaces. Keep contracts synchronized with implementation once those contracts are formally introduced.

## 3. Baton-Pass Ownership

FarmOS is developed through milestone ownership rather than simultaneous free-form changes.

- **Antigravity** primarily owns UX structure, frontend implementation, responsive/browser validation, low-input workflows, prototypes, and AI-assistant/approval experience.
- **Codex** primarily owns formal requirements, architecture, bounded contexts, backend/domain logic, database/migrations, security, tenant isolation, inventory/production/finance kernels, APIs/events, MCP/tool gateway, and hardening.

Only the currently assigned milestone is in scope. If work outside the milestone is needed, record it in `BACKLOG.md` or `KNOWN_ISSUES.md`; do not silently expand scope.

## 4. Architecture Change Rule

Create or update an ADR in `docs/02-architecture/adr/` before making a major change to any of the following:

- primary runtime/framework or persistence strategy
- tenancy/isolation model
- modular-monolith boundaries
- `ProductionCycle` core model
- item/UOM/lot model
- inventory or accounting ledger approach
- workflow/approval architecture
- event versioning approach
- offline command/idempotency strategy
- MCP/AI security model
- major infrastructure dependency

An ADR records the decision; it does not grant permission to contradict the master blueprint without an explicit project decision.

## 5. Definition of Done for a Material Feature

A feature is not done because a screen renders or an endpoint returns success. Consider, where applicable:

- domain invariants and validation
- tenant isolation and permission checks
- idempotency/concurrency behavior
- audit and provenance
- inventory consequences
- financial/costing consequences
- traceability consequences
- event/outbox consequences
- analytics/metric consequences
- error recovery and retries
- offline behavior for field-facing workflows
- localization/UOM/timezone behavior
- API/contract documentation
- observability
- automated tests and regression coverage
- migration/rollback compatibility
- AI tool exposure and approval policy

## 6. Mandatory Milestone Completion Checklist

Before marking a milestone `COMPLETE`:

- [ ] Complete only the assigned scope and acceptance gates.
- [ ] Run all applicable tests/checks that exist at this stage.
- [ ] Verify affected user flows (browser/device widths for frontend milestones).
- [ ] Update `docs/08-project/CURRENT_STATE.md`.
- [ ] Update `docs/08-project/MILESTONES.md`.
- [ ] Update `docs/08-project/BACKLOG.md` for completed/new work.
- [ ] Update `docs/08-project/KNOWN_ISSUES.md` for real blockers, risks, or unresolved decisions.
- [ ] Update architecture/API/event/MCP/database documentation when its contract changed.
- [ ] Document migrations and new dependencies, if any.
- [ ] Create `docs/08-project/handoffs/MXX.md` using the handoff structure established by M00.
- [ ] State what was verified, what remains unresolved, and exactly what the next agent should read/do.
- [ ] Mark the milestone complete and identify the next milestone.
- [ ] **STOP. Do not begin the next milestone.**

## 7. Documentation Discipline

Use these labels consistently:

- **Authoritative** — already decided by the master blueprint or approved ADR/contract.
- **Guardrail / Working Draft** — useful direction that is not yet frozen.
- **Illustrative** — example only; not a requirement or default.
- **Deferred** — deliberately postponed to a later milestone.

Do not convert illustrative numbers, sample thresholds, example IDs, vendors, retention periods, performance targets, or deployment patterns into product requirements unless explicitly approved.
