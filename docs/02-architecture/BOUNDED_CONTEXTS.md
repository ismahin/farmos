# FarmOS Bounded Contexts

> **Status: Authoritative (M02).** “Future” contexts establish dependency direction only; they do not expand MVP scope.

All commands below imply trusted tenant context, permission/entitlement checks, validation, idempotency for material mutations, audit, and optimistic concurrency as applicable.

## Foundational contexts

| Context | Purpose and owned aggregates | Public surface / events | Dependencies and invariants |
|---|---|---|---|
| Platform | SaaS control plane: `Tenant`, Plan, Subscription, Entitlement, FeatureFlag, UsageRecord. | Provision/suspend tenant; query effective entitlements; `TenantProvisioned`, `EntitlementChanged`. | Must not directly read customer ERP tables or bypass authorization. Tenant code/domain uniqueness is platform-owned. |
| Identity | Subjects and access grants: `User`, `Role`, Permission, UserRole, FarmAssignment, Session, ApiClient. | Authenticate/revoke; assign roles/scopes; effective-principal query; `RoleAssigned`, `SessionRevoked`. | Depends on Platform/Organization references. A grant cannot exceed administrator scope; disabled subjects cannot authenticate. |
| Organization | Customer structure: `Organization`, `LegalEntity`, `BusinessUnit`. | Create/update organizational structure; `OrganizationCreated`. | Tenant-scoped codes; legal entity owns base currency/accounting context. |
| Farm | Operational topology: `Farm`, Site, Zone, Enterprise, `ProductionUnit`, capability activation. | Compose/activate farm; unit availability query; `FarmActivated`, `ProductionUnitCreated`. | Depends on Organization/Platform entitlements. Physical topology must remain inside tenant/farm; capability activation is validated. |
| Catalog | Shared masters: `Item`, ItemCategory, `UnitOfMeasure`, conversion, `BusinessPartner`, species/breed/variety. | Manage/resolve item, UOM and partner; `ItemActivated`, `UomConversionChanged`. | No dependency on vertical modules. Compatible UOM dimensions, unique tenant codes, controlled effective dates. |

## Core ERP contexts

| Context | Purpose and owned aggregates | Public surface / commands/queries/events | Dependencies and invariants |
|---|---|---|---|
| Production | Common production kernel: `ProductionBlueprint`, version, `ProductionCycle`, `FarmEvent`, Measurement, Observation, Consumption, Output, Harvest reference. | Create/start/transition/close cycle; record common event; cycle/plan-v-actual queries; `ProductionCycleStarted`, `FeedConsumed`, `ProductionOutputRecorded`. | Farm, Catalog; never depends on a vertical. Started snapshot immutable; lifecycle and unit occupancy valid. |
| Poultry | Broiler semantics: `Flock`, Placement, Mortality/Cull, DailyRecord, WeightSample, HealthRecord, Vaccination, Harvest. | Place flock; record mortality/cull/feed/water/weight/health/vaccine/harvest; flock performance query; poultry events. | Production, Catalog, Inventory contracts. Quantity cannot exceed biologically available birds; events require eligible lifecycle. |
| Inventory | Shared physical truth: `Warehouse`, Bin, `InventoryLot`, `StockTransaction`, StockReservation, Transfer, StockCount, Position projection. | Receive/issue/return/transfer/adjust/reserve/release/hold/dispose; availability/lot query; `GoodsReceived`, `StockIssued`, `StockTransferred`. | Catalog, Farm; publishes consequences to Finance/Traceability. Ledger append-only; command cannot violate state/availability policy. |
| Procurement | Supplier buying: `PurchaseRequisition`, `PurchaseOrder`, later RFQ/quotation/receipt linkage. | Draft/submit/approve PR/PO; purchasing queries; `PurchaseOrderApproved`, `GoodsReceiptRequested`. | Catalog, Workflow, Inventory public receipt contract, Finance checks. Approval and ordered/received quantities valid. |
| Sales | Customer fulfillment: `SalesOrder`, Allocation, `Shipment`, Invoice-source reference. | Create/confirm order; allocate/ship; order/ATP query; `SalesOrderConfirmed`, `ShipmentDispatched`. | Catalog, Inventory, Workflow, Finance. Forecast supply is not physical ATP; allocation cannot exceed authoritative availability. |
| Finance | Accounting/economic truth: `Account`, `JournalEntry`, Payable, Receivable, Payment, BankAccount, Budget, CostCenter. | Post/reverse journal; recognize AP/AR; payment; profitability queries; `InvoicePosted`, `PaymentReceived`. | Organization plus source-module contracts/events. Entries balance, posted rows immutable, periods/permissions enforced. |
| Traceability | Cross-domain genealogy: `TraceableObject`, TraceEvent, GenealogyLink, ShipmentTrace. | Record transformation/consumption/shipment links; upstream/downstream recall query. | Consumes stable IDs/events from Inventory/Production/Sales. Links are immutable/corrected explicitly and tenant-consistent. |
| Workflow | Configured human decisions: `WorkflowDefinition`, version, `WorkflowInstance`, ApprovalRequest. | Start/evaluate/approve/reject/cancel; pending approvals; approval events. | Identity/resource snapshots and callers. Definition version frozen per instance; approver cannot exceed scope; no self-approval where policy forbids. |
| Audit | Tamper-resistant evidence: `AuditRecord`, integrity chain/export batch. | Append/search/export authorized audit facts. | Receives application context from every module; cannot be a command side channel. Immutable to ordinary application roles. |

## Supporting and future contexts

Tasks, Notifications, Documents, Quality, Analytics and AIIntegration are supporting contexts. HR, Assets, Maintenance, Processing, Livestock, Fisheries, Crops and IoT are future contexts. They consume public contracts/events and own their own data. Analytics read models are derived; Documents own blobs/metadata but not the business record; AIIntegration owns agent sessions/tool execution evidence but not ERP facts.

## Feed-issue application contract example

The orchestration receives `IssueFeed(flockId, sourceBinId, lotId, quantity, occurredAt, reason)`. Poultry resolves the active cycle and biological eligibility; Inventory locks the scoped position and appends the issue; Production appends consumption/FarmEvent; Traceability links lot to cycle; Finance receives source cost layers/attribution; Audit and outbox records commit with all state. A failure rolls back all synchronous consequences. Analytics/reorder/FCR projections consume post-commit events. No module edits another module’s tables directly.
