# FarmOS MVP Software Requirements Specification

> **Status: Authoritative (M02).** Scope is the poultry-first MVP in `MVP_SCOPE.md`; later-vertical examples are extensibility constraints, not MVP commitments.

## 1. Functional requirements

| ID | Requirement | Acceptance criterion |
|---|---|---|
| FR-SAAS-001 | The platform shall provision a tenant, organization, owner, entitlements, and tenant-isolated settings. | A provisioned owner can access only the new tenant and enabled capabilities. |
| FR-ORG-001 | A tenant shall manage organizations/legal entities, business units, users, roles, permissions, and farm assignments. | Effective access is the intersection of tenant, permission, entitlement, and resource scope. |
| FR-FARM-001 | An authorized user shall create farms, sites/zones, broiler enterprises, houses, warehouses, and bins using progressive configuration. | Activation rejects missing required configuration and retains a reviewable topology. |
| FR-CAT-001 | The system shall maintain one shared item/category/UOM/partner catalog for purchased, consumed, produced, and sold things. | Every material quantity has a compatible UOM; vertical modules do not create separate item masters. |
| FR-PROD-001 | The system shall manage a `ProductionCycle` as a time-bounded production and economic activity linked to one farm, enterprise, production unit, cost center, and immutable blueprint snapshot. | Starting a cycle freezes its blueprint snapshot; later blueprint edits do not alter the cycle. |
| FR-PROD-002 | Valid physical events shall propagate their production, inventory, costing, traceability, audit, and event consequences once. | A retried command returns its prior result and does not double-post consequences. |
| FR-POUL-001 | The broiler module shall support flock placement, mortality/culls, feed/water, weights, health/vaccination, partial/full harvest, and lifecycle control. | Commands enforce lifecycle and biological quantity invariants. |
| FR-INV-001 | The system shall support lot-aware receipt, issue, return, transfer, reservation/release, hold/release, adjustment, disposal, and production receipt. | The immutable ledger reconciles to positions by item, lot, location, and state. |
| FR-INV-002 | Availability shall distinguish physical, reserved, allocated, in-transit, quality-hold, quarantined, damaged, rejected, expired, and expected quantities. | Queries never present a single ambiguous stock balance. |
| FR-PROC-001 | The MVP shall support suppliers, purchase requisitions, configurable approvals, purchase orders, and goods receipts/QC linkage. | A receipt references its PO/source and creates valid inventory lots/ledger entries. |
| FR-SALES-001 | The MVP shall support customers, orders, allocation, shipment, invoice, and collection. | Forecast output remains distinguishable from on-hand/available finished goods. |
| FR-FIN-001 | Finance shall provide AP/AR, cash/payment, immutable double-entry journal foundations, cycle costs, revenue, and poultry-cycle profitability. | Posted journals balance and are corrected only by reversal/adjustment. |
| FR-WF-001 | Configurable workflows shall support approvals for material purchasing, payment, discount, stock adjustment/disposal, quality release, and medicine actions. | Thresholds and approver rules are versioned configuration, not client constants. |
| FR-TRACE-001 | The system shall preserve who/what/where/when/why and genealogy from input lot through cycle, output lot, shipment, and customer. | A lot can be traced upstream and downstream without inference from free text. |
| FR-OPS-001 | Users shall receive role- and scope-appropriate Today, task, exception, approval, and notification views. | Dashboard values are projections of authoritative backend facts. |
| FR-AUD-001 | Material mutations shall record actor, trusted scope, time, source/device/session, reason, before/after or immutable references, approval, correlation, and AI involvement. | Ordinary business users cannot update/delete audit records. |
| FR-AI-001 | Hermes shall access FarmOS only through narrow authenticated FarmOS tools and shall not own ERP truth. | No tool permits arbitrary SQL, unrestricted internal HTTP, tenant override, or approval bypass. |
| FR-AI-002 | High-risk AI-originated actions shall create drafts/proposals and pass normal authorization and configured HITL policy. | Tool execution is auditable and has the same validation/idempotency as UI/API commands. |

## 2. Data and integration requirements

| ID | Requirement | Acceptance criterion |
|---|---|---|
| DR-001 | PostgreSQL is the transactional source of truth; core facts use typed relational fields and foreign keys. | JSONB is limited to controlled metadata/configuration, never core quantities or balances. |
| DR-002 | Tenant-owned rows carry `tenant_id`; uniqueness and foreign-key relationships include tenant scope where needed. | Cross-tenant references are rejected by constraints and tested policies. |
| DR-003 | IDs are UUIDv7; time is stored as UTC instants with farm timezone retained for presentation/business-day interpretation. | Offline-created IDs do not collide; occurred and recorded times remain distinct. |
| DR-004 | Money uses ISO 4217 currency plus fixed-precision decimal values; quantities use decimal value plus UOM. | No authoritative money or quantity arithmetic uses binary floating point. |
| INT-001 | Business APIs shall be REST/OpenAPI under `/api/v1`; material commands support correlation, idempotency, and optimistic concurrency where applicable. | Generated contract tests validate documented requests, responses, and standard errors. |
| INT-002 | Committed integration events shall use a transactional outbox and versioned envelopes. | State and outbox record commit atomically; consumers are idempotent. |
| INT-003 | Field clients may queue offline commands, but the server remains authoritative for stock, finance, permissions, and lifecycle conflicts. | Conflicting material commands return a reviewable error rather than silently merging. |

## 3. Security, quality, and operational requirements

| ID | Requirement | Acceptance criterion |
|---|---|---|
| SEC-001 | Tenant context shall come from validated server authentication/session context, never request bodies, headers controlled by untrusted clients, or AI arguments. | Negative tests cannot read or mutate a second tenant by changing identifiers. |
| SEC-002 | Authorization shall combine RBAC with contextual policy for organization/farm/unit, entitlement, action, state, and monetary threshold. | UI visibility is not required for backend denial to work. |
| SEC-003 | Credentials, sessions, uploads, service accounts, production access, and encryption shall follow `SECURITY.md`. | Security controls are exercised in integration tests before release. |
| NFR-001 | The backend shall be a modular monolith with enforceable module boundaries and no arbitrary cross-module table access. | Architecture tests reject forbidden project/module references. |
| NFR-002 | Critical operations shall be atomic, concurrency-safe, observable, recoverable, and auditable. | Integration tests cover rollback, retries, duplicate commands, and concurrent conflicts. |
| NFR-003 | Field-facing workflows shall remain compatible with intermittent connectivity and low-input interaction. | Clients can submit stable IDs/idempotency keys and surface server conflicts. |
| NFR-004 | The web experience shall remain responsive and accessible at the representative M01 viewports; exact performance/SLO targets are deferred until measured. | Existing lint, typecheck, tests, and production build pass. |
| NFR-005 | Logs, traces, and metrics shall use correlation identifiers and avoid secrets/sensitive payloads. | A command can be followed through HTTP, transaction, outbox, and consumer without exposing private data. |

## 4. Explicit MVP exclusions

Advanced payroll/manufacturing, non-poultry production depth, unrestricted AI autonomy, full EPCIS, data lake/warehouse, dedicated search, Kubernetes, microservice decomposition, and fixed universal SLO/RPO/RTO/retention numbers are **Deferred**.
