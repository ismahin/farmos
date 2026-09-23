# FarmOS Domain and Architecture Glossary

> **Status:** Canonical terminology derived from the master blueprint. Detailed data-field definitions are frozen in later engineering specifications.

## SaaS / Organization

**Tenant** — Commercial SaaS customer boundary.

**Organization / Legal Entity** — Accounting/legal entity inside a tenant.

**Farm** — Operational farm location.

**Site / Zone / Block** — Subdivision of a farm used to organize physical space.

**Enterprise** — A production business/capability such as broiler poultry, dairy cattle, tilapia, or maize.

**Capability** — Effective feature set enabled by subscription entitlement, enterprise type, tenant configuration, and user permission.

**Control Plane** — SaaS platform functions such as tenant provisioning, subscriptions, entitlements, feature flags, usage metering, and platform administration.

**Data Plane** — Customer farm operations such as production, inventory, procurement, sales, finance, tasks, traceability, analytics, IoT, and AI tool execution.

## Production

**ProductionUnit** — Physical place/container of production, such as a poultry house, barn, pond, field, greenhouse, or cage.

**ProductionCycle** — Time-bounded production/economic activity linking plan, inputs, actual consumption, health/environment observations, outputs, cost, revenue, and margin. Examples include a broiler flock, tilapia pond cycle, crop cycle, or cattle-fattening group.

**Production Blueprint** — Versioned operational template containing defaults/targets/tasks/requirements/KPIs for a production type. Historical cycles reference the exact blueprint/version used.

**IndividualAnimal** — Persistent individually managed animal record (used when the vertical requires individual identity rather than group/cycle management).

**FarmEvent** — Normalized operational event/journal record connecting a real-world occurrence to tenant/farm/cycle/entity context, provenance, correlation, causation, and idempotency information.

**Planned vs Actual** — Consistent comparison of planned targets/budgets/requirements with authoritative actual events and transactions.

## Inventory / Traceability

**Item / Product** — Master-data representation of something bought, consumed, produced, stocked, or sold.

**Lot / Batch** — Traceable grouping of material, product, or biological stock.

**InventoryLot** — Lot-specific stock record carrying item, source/supplier, dates/expiry, cost, quantity/location, quality status, and traceability metadata as applicable.

**Stock States** — Distinguish physical on hand, reserved, available, allocated, in transit, quality hold, quarantined, expired, damaged, rejected, and expected incoming where relevant.

**FEFO** — First-Expired, First-Out operational picking policy typically appropriate for expiry-sensitive materials such as medicine/vaccine.

**FIFO** — First-In, First-Out operational/accounting method where configured/required.

**Traceability / Genealogy** — Relationships connecting source inputs/lots through production, transformations, harvest/output lots, shipments, and customer destinations.

**Critical Tracking Event** — Traceability-significant event such as receiving, consuming, treating, transforming, harvesting, packing, storing, shipping, receiving, or disposal.

## Commercial / Finance

**BusinessPartner** — External party such as supplier, customer, veterinarian, processor, transporter, or other partner.

**Purchase Requisition (PR)** — Internal request to procure items/services, subject to configured workflow/approval.

**Purchase Order (PO)** — Authorized order to a supplier.

**Goods Receipt** — Authoritative record that ordered/expected goods were received, including lot/quality/quantity details as applicable.

**Available-to-Promise (ATP)** — Availability calculation that considers physical finished stock, reservations/commitments/quality holds and, when explicitly shown separately, expected production/harvest.

**Accounts Payable / Accounts Receivable (AP/AR)** — Supplier obligations and customer receivables.

**Cost Center** — Accounting/costing dimension used to attribute cost to organization/farm/enterprise/unit/cycle/department/project as configured.

**Cycle Profitability** — Revenue and authoritative allocated costs associated with a production cycle, used to derive margin/profitability metrics.

## Poultry

**Flock** — Poultry production group associated with a production cycle/house for its lifecycle.

**Placement** — Introduction of chicks/birds into the production unit/cycle, establishing starting quantity/source/weight/date facts.

**Mortality** — Bird deaths recorded against a flock/cycle with quantity/time and optional cause/evidence according to workflow.

**Cull** — Intentional removal of birds from the live flock for health/quality/management reasons.

**FCR (Feed Conversion Ratio)** — Configured poultry efficiency metric relating feed consumption to weight/output according to the semantic metric definition used by FarmOS.

**ADG (Average Daily Gain)** — Growth metric derived from authoritative weight/time data according to the central metric definition.

**Livability** — Proportion/percentage of placed birds remaining alive according to the configured metric definition.

**Withdrawal Period** — Time during which products/animals may be restricted following applicable treatment/medicine use according to policy/regulation.

## AI / Automation

**Hermes Agent** — Self-hosted conversation/orchestration/tool-use layer. It is not the system of record or authorization/accounting/inventory engine.

**farm-erp-mcp / Tool Gateway** — FarmOS-owned controlled tool surface used by Hermes/agent clients to read or request business actions through normal policy/domain services.

**Human-in-the-Loop (HITL)** — Policy pattern requiring authorized human review/approval for actions whose financial, safety, regulatory, biological, destructive, or irreversibility risk warrants it.

**Autonomy Levels** — Level 0 Record, Level 1 Assist, Level 2 Prepare, Level 3 Execute Under Policy, Level 4 Human-Approved Autonomy.

**Data Provenance** — Ability to trace important values to source type/source ID, measured/received time, actor, confidence/verification state, and algorithm/model version when applicable.
