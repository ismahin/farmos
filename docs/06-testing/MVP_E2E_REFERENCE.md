# Golden Poultry MVP End-to-End Scenario

> **Status: Authoritative reference (M02).** Later milestones progressively make this executable.

| Step | Authoritative result / key assertion |
|---:|---|
| 1 | Create Tenant -> isolated active tenant, owner and entitlements. |
| 2 | Create Organization -> legal/accounting context and base currency. |
| 3 | Create Farm -> scoped farm with IANA timezone. |
| 4 | Configure Broiler Enterprise, House and Warehouse -> valid topology/capability. |
| 5 | Create Feed Item/UOM and Supplier -> shared catalog, lot/expiry policy. |
| 6 | PR -> approval -> PO -> Receive Feed Lot -> source documents, QC state, immutable receipt and available position. |
| 7 | Create Broiler Cycle -> immutable blueprint snapshot, house occupancy and cost center. |
| 8 | Place Birds -> flock/live balance, placement source and FarmEvent. |
| 9 | Issue Feed -> stock decreases once; lot-to-cycle genealogy, consumption, cost attribution, plan variance/FCR input and outbox share correlation. |
| 10 | Record Mortality and Weight -> biological invariants and provenance; deterministic KPI inputs. |
| 11 | Harvest -> live balance reduces, finished-goods lot/output/cost genealogy created. |
| 12 | Create Customer, Sales Order, Allocation, Shipment -> availability cannot be oversold; shipped lot traces to customer. |
| 13 | Invoice and Payment -> receivable/payment/journal references source and balances reconcile. |
| 14 | Close Cycle -> inventory/biological/cost/output exceptions resolved; immutable close/version. |
| 15 | View Cycle Profitability -> authoritative revenue/cost/margin matches journals/source transactions. |

At every step assert tenant/permission denial, stable idempotent replay, concurrency behavior, audit, correlation, and rollback on failure. Final assertions reconcile physical stock, bird balance, journal balance, source-to-posting references, upstream/downstream traceability, and zero duplicate consequences.
