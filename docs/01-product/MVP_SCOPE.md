# FarmOS MVP Scope

> **Status:** Authoritative product scope derived from the master blueprint. Implementation details remain milestone-specific.

## 1. Purpose

The first commercial MVP is intentionally narrower than the full Agriculture Operating System. Its purpose is to prove that FarmOS can execute one complete agricultural business loop correctly and simply for a real tenant, while keeping the architecture reusable for later cattle, fisheries, crops, processing, IoT, and advanced analytics.

The primary proof is:

**Buy → Stock → Consume → Produce → Harvest → Sell → Collect → Profit**

The first deep production vertical is **poultry**, with broiler as the principal end-to-end reference flow.

## 2. In-Scope Capability Areas

### SaaS Foundation
- tenant and organization foundation
- farm creation and farm scoping
- users, roles, permissions, assignments
- subscription/entitlement basics sufficient to control capabilities
- audit foundation

### Farm Composer
- select the poultry enterprise/capability
- create farm topology using practical list/tree workflows first
- add poultry houses and warehouse/storage locations
- attach a production blueprint
- progressively configure only what the active workflow requires
- conversational farm-setup drafting may be introduced as part of AI V1; it must create drafts, not production truth

### Poultry / Broiler
- flock/production-cycle creation and placement
- mortality and culls
- feed and water consumption
- weight sampling and growth tracking
- health and vaccination records
- partial/full harvest
- core broiler KPIs from deterministic definitions

### Inventory
- item/UOM foundations
- warehouses/bins as needed
- lots/batches and expiry metadata
- receipt, issue, return/transfer foundations, reservation/availability where required by the flow
- traceable consumption of input lots into production
- operational FEFO for expiry-sensitive items where configured

### Procurement
- supplier foundation
- purchase requisition
- purchase order
- goods receipt
- enough linkage to inventory and finance foundations to support the end-to-end chain

### Sales
- customer foundation
- sales order
- allocation/dispatch/shipment foundation
- invoice
- payment/collection recording

### Finance Lite / Production Economics
- expense/payable/receivable foundations needed by the MVP flow
- cash/payment basics
- production-cycle costing hooks
- cycle profitability / P&L view
- authoritative arithmetic remains deterministic and references originating business transactions

### Operations
- tasks
- alerts/rules foundation
- documents/evidence
- notifications foundation

### Analytics
- poultry dashboard
- farm dashboard
- cycle profitability
- planned vs actual for the MVP metrics that have deterministic definitions

### AI V1
- self-hosted Hermes integration later in the roadmap
- read-only Q&A over verified ERP tools
- morning briefing
- farm-setup draft assistance
- document extraction where implemented
- action drafts with human confirmation

## 3. Explicitly Deferred Unless a Pilot Requires Them

- full cattle/livestock module
- fisheries/aquaculture module
- crop/horticulture module
- advanced payroll
- advanced manufacturing/processing depth
- deep ML forecasting
- route optimization
- multi-company consolidation
- full marketplace
- custom data warehouse/lakehouse
- broad microservice decomposition
- unrestricted AI autonomy
- enterprise SSO and advanced enterprise integrations unless brought forward by an approved requirement
- visual/map-based Farm Composer beyond the list/tree MVP unless a pilot specifically requires it

## 4. End-to-End Acceptance Narrative

A successful MVP tenant can:

1. Create an organization and farm.
2. Configure a poultry enterprise, at least one house, and storage needed for the flow.
3. Create master data required for chicks/feed/medicines/products, suppliers, and customers.
4. Purchase and receive traceable feed/input lots.
5. Start a broiler production cycle and place birds.
6. Record daily production facts with minimal redundant input.
7. Issue inventory to the active cycle so stock, production, cost, traceability, and analytics consequences are connected.
8. Record health/weight/mortality and view deterministic performance metrics.
9. Harvest and create traceable output/finished-goods availability appropriate to the configured sales model.
10. Sell/dispatch, invoice, collect payment, and close the production cycle.
11. View final cycle cost, revenue, margin, and traceability links.

## 5. MVP Quality Principles

The blueprint requires measurable targets to be selected during product specification; M00 must not invent hard numbers. The MVP must nevertheless demonstrate these qualities:

- tenant isolation and authorization are testable
- stock and financial arithmetic reconcile deterministically
- important mutations are auditable
- critical movements are traceable through source and destination relationships
- common field actions minimize manual entry and unnecessary dropdowns
- field-facing command design supports future poor/offline connectivity and idempotent replay
- AI can assist and prepare but cannot bypass FarmOS authority or high-risk approval gates
- the ERP remains functional without AI

Specific latency, retention, RPO/RTO, maximum-field-count, response-time, and traceability-time targets are to be defined and approved in later specification/operations milestones rather than treated as M00 facts.
