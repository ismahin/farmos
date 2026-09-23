# FarmOS Project Backlog

> **Status:** Living milestone backlog. Items describe intended outcomes; exact implementation choices follow approved ADRs/contracts.

## M00 — Project Knowledge Base — `COMPLETE`
- [x] Preserve canonical master blueprint.
- [x] Create `AGENTS.md`, project README, product/MVP docs, glossary, journeys.
- [x] Create M00 UX information architecture, user flows, screen registry.
- [x] Create ADR framework and record blueprint-mandated modular-monolith/PostgreSQL direction.
- [x] Create guardrail scaffolds for database, contracts, testing, AI, operations.
- [x] Create milestones, backlog, current state, issues, handoff protocol.
- [x] Perform post-generation M00 review and remove premature/unsupported technical assumptions.

## M01 — Frontend Foundation / UX Prototype — `COMPLETE`
- [x] Initialize `apps/web` with Next.js + TypeScript frontend only.
- [x] Establish frontend folder conventions and reusable UI primitives/design tokens.
- [x] Build responsive authenticated-style application shell and navigation using mock auth/context.
- [x] Build mock Home, Today, Farms, Production, Stock, Purchasing, Sales, Money, Analytics, AI Assistant entry point.
- [x] Prototype Signup → Organization → Farm → Poultry/Broiler → Houses → Warehouse → Farm dashboard.
- [x] Use realistic typed mock data; keep authoritative ERP calculations/business rules out of client code.
- [x] Verify representative flows at mobile/tablet/desktop widths.
- [x] Update UI docs if the prototype reveals navigation/flow improvements.
- [x] Create `handoffs/M01.md` and stop.

### Discovered Backend Capabilities for Codex M02 / M03:
- [ ] Backend Farm Summary & Context API (`GET /api/v1/farms/summary` providing capacity, active cycles, and severity counts).
- [ ] Backend Active Production Cycle Query (`GET /api/v1/production/cycles?status=ACTIVE` with live bird count and day-of-cycle).
- [ ] Backend Operational Exception & Alert Aggregator (`GET /api/v1/operations/exceptions` answering "What needs my attention").
- [ ] Backend Multi-State Inventory Position Ledger Query (`GET /api/v1/inventory/positions` returning on-hand, reserved, available, quality hold, expiring soon).
- [ ] Backend Idempotent Field Fast-Log Command Endpoints (`POST /api/v1/production/events/mortality`, `feed-issue`, `weight-sample` with server-side context resolution and duplicate protection).
- [ ] Backend HITL Action Proposal & Approval Workflow (`POST /api/v1/actions/proposals/{id}/approve` with authorized human sign-off).


## M02 — Technical Architecture Freeze — `COMPLETE`
- [x] Produce formal MVP SRS with numbered requirements and acceptance criteria.
- [x] Define bounded contexts, aggregate roots, invariants, commands, domain events, module dependency rules.
- [x] Select backend runtime/framework and supporting libraries/tooling via ADRs.
- [x] Produce production ERD v1 including tenant strategy, keys/indexes and versioned/temporal data.
- [x] Define item/UOM, ProductionCycle/blueprint, InventoryLot, costing and traceability models.
- [x] Define authorization and tenant isolation strategy.
- [x] Define REST/OpenAPI, errors, idempotency, concurrency and correlation conventions.
- [x] Define event versioning/registry and transactional outbox conventions.
- [x] Define database/migration rules and testing architecture.
- [x] Review M01 frontend assumptions and map mock replacement without changing M01.
- [x] Create `handoffs/M02.md` and stop before M03.

## M02A — Backend Technology Amendment — `COMPLETE`
- [x] Supersede ADR-0002 without deleting its historical context.
- [x] Select Node.js 24 LTS, strict TypeScript and NestJS as the backend platform.
- [x] Evaluate Prisma, MikroORM and Drizzle against FarmOS PostgreSQL/transaction/RLS needs.
- [x] Select Drizzle ORM/Kit with `pg` and define the parameterized SQL escape hatch.
- [x] Define Vitest, Nest testing/Supertest and Testcontainers-backed PostgreSQL testing.
- [x] Update affected architecture, database, testing, operations, state and M02 handoff documents.
- [x] Confirm M03 remains planned and no backend source exists.

## M03 — SaaS Backend Foundation — `COMPLETE`
- [x] Scaffold Node.js 24/NestJS strict-TypeScript module/build/test infrastructure.
- [x] Implement Tenant, Organization/LegalEntity, identity/user/role/permission/session/farm-assignment foundations.
- [x] Implement the M03 Farm CRUD/list foundation with bounded cursor pagination and ETags.
- [x] Implement opaque authentication, trusted tenant resolution, deny-by-default RBAC, and farm-scope policy.
- [x] Implement immutable audit, request correlation, idempotency, and transactional outbox foundations.
- [x] Implement reviewed Drizzle/SQL migration, forced RLS/runtime roles, OpenAPI, Problem Details, health, and OpenTelemetry.
- [x] Prove tenant isolation, pooled-context cleanup, tenant-aware FKs, idempotency/concurrency, and the golden API journey against real PostgreSQL.

## M03B — Browser Authentication Bridge — `COMPLETE`
- [x] Preserve M03 opaque revocable sessions while adding explicit HttpOnly cookie transport.
- [x] Enforce Secure cookies in production, SameSite=Lax, `/api` path, and explicit expiry.
- [x] Implement exact-Origin CSRF enforcement for unsafe cookie requests and narrow credentialed CORS.
- [x] Expand `/me` with safe authoritative user, tenant, permissions, and farm scope.
- [x] Prove cookie login, logout/revocation, expiry, disabled users, tenant authority, and farm scope against real PostgreSQL.
- [x] Publish the actionable M04 browser-authentication contract and stop before M04.

## M04 — SaaS UX Integration — `PLANNED`
- [ ] Connect sign-in/session UX to the M03B cookie and `/me` contracts.
- [ ] Connect organization/farm creation/selection and team/role/settings foundations.
- [ ] Add loading/error/empty/permission-denied states.
- [ ] Keep security enforcement server-side; client guards are UX only.
## M04 — SaaS UX Integration — `COMPLETE`
- [x] Connect sign-in/session UX to the M03B cookie and `/me` contracts (`POST /api/v1/auth/login`, `GET /api/v1/me`, `POST /api/v1/auth/logout`).
- [x] Connect organization/farm creation/selection and team/role/settings foundations to real backend APIs with ETags and idempotency keys.
- [x] Add loading/error/empty/permission-denied states with RFC 9457 Problem Details and correlation ID display.
- [x] Keep security enforcement server-side; client guards are UX only.
- [x] Remove mock persona switching as authentication; derive UI capabilities strictly from backend permissions.
- [x] Preserve all downstream modules (Production, Stock, Purchasing, Sales, Money, Analytics, AI Assistant) as mock-backed prototypes.

## M05 — Farm Composer UX — `PLANNED`
- [ ] Build tree/list farm composer for enterprise, houses, warehouses/storage, blueprint selection.
- [ ] Build progressive configuration and review/activation UX.
- [ ] Represent conversational farm-setup draft as a typed prototype/placeholder if backend/AI not available yet.
- [ ] Do not require a drag/drop visual map for MVP.

## M06 — Farm Composer + Master Data Backend — `PLANNED`
- [ ] Implement enterprise/capability, production unit, blueprint/version, farm topology services.
- [ ] Implement item, UOM/conversion, partner, warehouse/bin foundations required by upcoming inventory.
- [ ] Implement draft/activation validation and provisioning of dependent records as defined by M02.

## M07 — Inventory Kernel — `PLANNED`
- [ ] Implement lot-aware inventory model and immutable/append-only stock transaction history.
- [ ] Implement receipt, issue, return/transfer, reservation/release, adjustment/hold/disposal foundations as required.
- [ ] Implement physical/reserved/available/allocated/hold states defined by the domain design.
- [ ] Add FEFO operational selection for expiry-sensitive items where configured.
- [ ] Add idempotency, concurrency protection, audit, traceability and costing hooks.

## M08 — Inventory UX — `PLANNED`
- [ ] Build item/warehouse/bin/lot screens.
- [ ] Build stock overview and availability/status views.
- [ ] Build receipt/issue/transfer flows and scan-friendly interaction points.

## M09 — Poultry UX Prototype — `PLANNED`
- [ ] Build flock placement/start wizard.
- [ ] Build flock control center with target-vs-actual placeholders.
- [ ] Build mortality/feed/weight/health/vaccination fast-log prototypes.
- [ ] Build partial/full harvest UX.

## M10 — Production Kernel — `PLANNED`
- [ ] Implement `ProductionCycle` and blueprint/version snapshot model.
- [ ] Implement operational event journal, measurement/observation/consumption/output/harvest foundations.
- [ ] Implement tasks and planned-vs-actual/costing/traceability hooks.
- [ ] Implement transactional outbox/event publication foundation.

## M11 — Poultry Domain Backend — `PLANNED`
- [ ] Implement broiler placement, mortality, cull, feed/water, weights, health/vaccination, harvest.
- [ ] Implement deterministic KPI formulas using central metric definitions.
- [ ] Ensure feed/medicine/harvest operations connect inventory, production, cost, traceability, audit, outbox/events.
- [ ] Add tenant/permission/idempotency/concurrency tests for material commands.

## M12 — Poultry Operations UX — `PLANNED`
- [ ] Replace poultry mock operations with real APIs.
- [ ] Optimize worker flows for context inheritance/minimal input.
- [ ] Implement the M02-approved connection/offline UX strategy if included in MVP scope.
- [ ] Add evidence/photo capture only where the backend/domain workflow actually supports it.

## M13 — Procurement Backend — `PLANNED`
- [ ] Implement supplier, PR, approvals, PO, goods receipt/QC linkage.
- [ ] Implement deterministic requirement calculation foundations using plan/stock/reservations/open orders/lead time inputs where available.
- [ ] Keep RFQ/quotation/three-way-match depth proportional to MVP requirements; do not overbuild before invoice/AP foundations exist.

## M14 — Sales + Finance Lite Backend — `PLANNED`
- [ ] Implement customer, sales order, allocation, shipment/dispatch, invoice, collection.
- [ ] Implement AP/AR/cash/payment and posting foundations sufficient for the MVP flow.
- [ ] Accumulate production-cycle cost and calculate cycle profitability from authoritative transactions.
- [ ] Keep jurisdiction-specific tax/accounting configuration extensible rather than hard-coded.

## M15 — Commercial + Finance UX — `PLANNED`
- [ ] Purchasing/receiving operational UI.
- [ ] Sales order/allocation/dispatch/invoice/payment UI.
- [ ] Cycle profitability and receivable/payable foundation views.

## M16 — Poultry End-to-End Integration — `PLANNED`
- [ ] Automate the complete Buy → Stock → Consume → Produce → Harvest → Sell → Collect → Profit test.
- [ ] Assert stock reconciliation, cost flow, traceability, audit and tenant isolation through the journey.
- [ ] Verify duplicate/replayed material commands do not double-post.

## M17 — Poultry End-to-End UX — `PLANNED`
- [ ] Execute all core journeys through the browser on representative viewports.
- [ ] Remove redundant entry, confusing transitions, frontend-only calculations, and weak error states.
- [ ] Return backend contract defects to Codex as backlog/issues rather than patching around them in the UI.

## M18 — Analytics + Rules + Alerts Backend — `PLANNED`
- [ ] Create central semantic metric definitions for required MVP KPIs.
- [ ] Implement projections/read models and plan-vs-actual outputs.
- [ ] Implement configurable deterministic rules/alerts, exception/task/notification foundations.

## M19 — Dashboards + Exception UX — `PLANNED`
- [ ] Owner/executive summary.
- [ ] Manager exception/approval view.
- [ ] Worker Today/task view.
- [ ] Poultry/farm profitability and production dashboards using backend-authoritative metrics.

## M20 — Hermes + MCP Infrastructure — `PLANNED`
- [ ] Integrate self-hosted Hermes through FarmOS AI gateway.
- [ ] Implement `farm-erp-mcp`/tool gateway, auth/policy/audit/telemetry.
- [ ] Start with read tools (`get_farm_overview`, `get_inventory_position`, `get_flock_performance`, `get_alerts`, `get_pending_approvals`, `get_profitability`).
- [ ] Add AI evaluation/logging foundations and tenant retrieval boundaries.

## M21 — AI Assistant UX — `PLANNED`
- [ ] Connect assistant UI to real gateway.
- [ ] Show verified evidence/source links where available.
- [ ] Build morning briefing and useful contextual suggested queries/actions.

## M22 — HITL Agent Actions — `PLANNED`
- [ ] Implement action-risk policy and approval-request model.
- [ ] Implement draft tools such as purchase request/task/stock-transfer drafts.
- [ ] Add preview/dry-run/resumable execution/audit as appropriate.
- [ ] Prove high-risk actions cannot bypass approval/authorization.

## M23 — Agentic Approval UX — `PLANNED`
- [ ] Build proposal details with evidence/policy warnings.
- [ ] Allow authorized users to modify/approve/reject.
- [ ] Build pending approvals/status/resume experience.

## M24 — Production Hardening — `PLANNED`
- [ ] Security/tenant isolation/prompt-injection/tool authorization tests.
- [ ] Concurrency/idempotency/reconciliation and migration tests.
- [ ] Backup/restore and failure/retry runbook verification.
- [ ] Performance/load profiling and index/query review; define/verify phase-appropriate SLOs.
- [ ] Observability, alerting and production access/secrets review.

## M25 — Release Candidate UX Audit — `PLANNED`
- [ ] Full persona journey audit.
- [ ] Responsive/accessibility/keyboard/error/empty/loading-state polish.
- [ ] Onboarding/help/release documentation.
- [ ] Record backend defects for Codex rather than changing protected core logic.
