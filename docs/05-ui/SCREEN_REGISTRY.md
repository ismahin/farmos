# FarmOS MVP Screen Registry

> **Status:** M00 screen inventory for M01 prototyping. Exact routes/names may be refined during implementation without changing domain semantics.

## Shell / Onboarding

| ID | Screen | Primary users | M01/MVP purpose |
|---|---|---|---|
| SH-001 | Sign in | All | Email/password scaffold initially; enterprise SSO is deferred unless later approved. |
| SH-002 | Organization/Farm context | Owner/Manager | Select active organization/farm when more than one accessible context exists. |
| SH-003 | Global app shell | All | Responsive navigation, active farm context, notifications placeholder, AI entry point placeholder. |
| ON-001 | Organization setup | Owner | Capture minimum business basics needed to proceed. |
| ON-002 | Farm creation | Owner | Create farm and timezone/basic settings. |

## Home / Today

| ID | Screen | Primary users | Purpose |
|---|---|---|---|
| DB-001 | Home | Owner/Manager | MVP dashboard shell with mock operational/financial/approval summaries in M01. |
| DB-002 | Today | Worker/Manager | Task-first view and rapid action entry points. |
| DB-003 | Exceptions / Approvals | Manager/Owner | Future exception-driven management surface; prototype may be mock-only in M01. |

## Farms / Composer

| ID | Screen | Primary users | Purpose |
|---|---|---|---|
| FM-001 | Farms | Owner/Manager | Farm directory and current capability summary. |
| FM-002 | Farm overview | Owner/Manager | Facilities, active production, key risks/tasks; no hard dependency on external weather in MVP. |
| FM-003 | Farm Composer | Owner/Setup | **Tree/list** setup of enterprises, houses, warehouses, blueprints. Conversational draft can be represented as a later/mock path. |
| FM-004 | Production-unit detail | Manager/Worker | House context, active flock, allowed actions, optional environmental summaries when data exists. |

## Poultry / Broiler

| ID | Screen | Primary users | Purpose |
|---|---|---|---|
| PR-001 | Flocks / cycles | Manager | Active/historical cycle list and deterministic KPI placeholders in M01 mocks. |
| PR-002 | Start/placement wizard | Manager | House, blueprint, source/placement facts. |
| PR-003 | Flock control center | Manager/Vet | Target vs actual, event timeline, health, cost/stock links. |
| PR-004 | Daily fast log | Worker/Manager | Minimal mortality/feed/weight/observation entry; no invented OCR requirement. |
| PR-005 | Harvest | Manager/Sales | Partial/full harvest facts and output traceability preparation. |

## Stock

| ID | Screen | Primary users | Purpose |
|---|---|---|---|
| ST-001 | Stock overview | Storekeeper/Manager | Physical, reserved, available, hold/expiry states. |
| ST-002 | Item master | Storekeeper/Admin | Item, category, base UOM, traceability/expiry behavior. |
| ST-003 | Lots/batches | Storekeeper/Quality | Lot, quantity, location, supplier/source, expiry/status. |
| ST-004 | Goods receipt | Storekeeper | PO/source receipt, quantity, lot/expiry/quality/evidence where applicable. |
| ST-005 | Issue / transfer | Storekeeper/Worker | Destination/cycle, lot recommendation, quantity, confirmation. |

## Purchasing

| ID | Screen | Primary users | Purpose |
|---|---|---|---|
| PU-001 | Requisitions / POs | Procurement/Manager | Demand/request/order statuses. |
| PU-002 | PO detail | Procurement/Manager | Lines, supplier, delivery/status/approval context. |
| PU-003 | Suppliers | Procurement | Supplier profile and basic commercial history. |

## Sales / Money

| ID | Screen | Primary users | Purpose |
|---|---|---|---|
| SL-001 | Sales orders | Sales/Manager | Customer, quantity, allocation, delivery status. |
| SL-002 | Create order | Sales | Customer, product/harvest availability, pricing/terms. |
| SL-003 | Dispatch / shipment | Sales/Storekeeper | Pick/dispatch facts and evidence appropriate to configured workflow. |
| SL-004 | Invoices | Accountant/Sales | Invoice amount/status/payment terms; jurisdiction-specific tax behavior is configuration/later design, not hard-coded in M00. |
| FN-001 | Cycle profitability | Owner/Accountant/Manager | Cost/revenue/margin by cycle using backend-authoritative metrics. |
| FN-002 | AP/AR / payments | Accountant | Payable/receivable/payment foundation needed by MVP. |

## AI / Settings

| ID | Screen | Primary users | Purpose |
|---|---|---|---|
| AI-001 | AI Assistant | Allowed users | Conversation shell; later connected to Hermes/FarmOS tools. |
| AI-002 | Action proposal | Approver | Evidence/parameters/policy warnings and approve/reject/modify controls. |
| AI-003 | Morning briefing | Owner/Manager | Verified exception summary and links to source records. |
| STG-001 | Organization/farm settings | Owner/Admin | Business, locale/timezone/UOM settings. |
| STG-002 | Users / permissions | Owner/Admin | User invitations, role/farm scope. |
| STG-003 | Capabilities | Owner/Admin | Effective capabilities/entitlements; not a simple unsafe client-side toggle. |
| STG-004 | Audit view | Owner/Auditor | Read-only search of auditable activity once backend support exists. |

M01 should prototype the shell and a representative subset rather than attempting every future screen at production depth.
