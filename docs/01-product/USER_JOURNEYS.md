# FarmOS End-to-End User Journeys

> **Status:** Product journeys grounded in the master blueprint. Quantities and names in examples are illustrative, not defaults or acceptance thresholds.

## Journey 1 — Tenant Onboarding and Farm Composition

**Primary actor:** Farm Owner / Administrator

```text
Create account
→ Create organization
→ Enter legal/business basics required for activation
→ Create farm
→ Select Poultry / Broiler
→ Define houses and storage in list/tree form
→ Choose/default a production blueprint
→ Configure team and roles
→ Import opening data if available
→ Review setup
→ Activate farm
```

UX principles:
- do not block activation for unrelated optional modules
- use defaults/templates for optional properties
- ask only material missing questions
- future conversational setup creates a draft that the owner confirms
- visual map/layout composition is a later enhancement; the MVP is usable without it

## Journey 2 — First Broiler Cycle End to End

**Primary actors:** Farm Manager, Storekeeper, Procurement, Worker, Sales, Accountant

```text
Create cycle
→ choose house and blueprint
→ place birds
→ receive/hold inventory as required
→ record daily events
→ issue feed/medicine lots to the cycle
→ record health and weights
→ monitor exceptions
→ replenish inputs
→ harvest
→ create traceable output lot/availability
→ sales order and dispatch
→ invoice
→ collect payment
→ close cycle
→ review profitability and variance
```

A feed issue illustrates the interconnected model: one validated issue should update stock, associate the lot to the cycle, record feed consumption, feed costing/KPI inputs, traceability, plan-vs-actual, and downstream analytics/events as applicable.

## Journey 3 — Low-Input Field Recording

**Primary actor:** Farm Worker

Example flow:

```text
Open Today or scan House-03
→ FarmOS resolves farm, house, active flock, worker, time, and allowed actions
→ choose Record Mortality
→ enter quantity
→ choose/enter reason if required
→ optionally attach evidence
→ confirm
→ server validates and records one authoritative command
```

The worker should not re-select known context. If connectivity is poor, the client design must be capable of queuing an idempotent command for later server validation according to the offline strategy frozen in later milestones.

## Journey 4 — Feed Procurement Assistance

**Primary actor:** Farm Manager / Procurement Officer

```text
Manager requests enough feed for a future planning window
→ Hermes identifies intent
→ FarmOS deterministic requirement service calculates demand
→ FarmOS checks available/reserved/on-order supply and policy inputs
→ shortage is returned by item/location/date
→ Hermes asks FarmOS to prepare a requisition draft
→ human reviews and modifies/approves according to workflow
→ normal procurement workflow continues
```

The LLM does not calculate authoritative stock or ledger values and does not approve/purchase on its own.

## Journey 5 — Morning Exception Briefing

**Primary actor:** Owner / Farm Manager

The user asks: **“What needs my attention?”**

FarmOS/Hermes retrieves purpose-built current views such as critical alerts, task exceptions, stock risks, production variances, approvals, receivables, expected harvest, and equipment/health exceptions. The answer summarizes verified exceptions and links back to source records; normal conditions are summarized rather than expanded.

## Journey 6 — Mixed-Farm Circular Value Chain (Post-MVP Expansion)

```text
Maize crop cycle
→ maize harvest lot
→ feed transformation/batch
→ poultry flock consumption
→ manure/by-product
→ compost transformation
→ crop field
```

Each internal movement retains quantity, cost allocation/transfer, and traceability. Internal transformation is not automatically treated as an external sale.
