# Inventory Architecture

> **Status: Authoritative (M02).** Detailed costing/posting matrices are **Deferred** to M07/M14.

Inventory is shared infrastructure. `Warehouse`, `Bin`, `InventoryLot`, `StockTransaction`, `StockReservation`, `Transfer`, `StockCount`, and `StockPosition` are Inventory-owned; no vertical-specific inventory exists.

## Ledger and positions

Every stock change is an explicit command: Receive, Issue, Return, Transfer, Adjust, Reserve, Release, Place/ReleaseHold, or Dispose. A command writes append-only transaction header/lines with tenant, source/destination, item, lot, state, source/canonical quantity+UOM, business reason/source document, actor, occurred/recorded time, correlation/causation, and valuation reference. Corrections append reversal/adjustment lines; posted lines are not edited/deleted.

`StockPosition` is a transactionally maintained/rebuildable projection keyed by tenant/item/lot/location/state. It distinguishes physical on-hand, reserved, allocated, in-transit, quality hold, quarantine, expired, damaged, rejected, and expected incoming. `available` is a deterministic query, not a manually writable balance.

## Concurrency and atomicity

Material commands run in one PostgreSQL transaction with idempotency record, row lock (`SELECT ... FOR UPDATE`) on the smallest scoped position/reservation rows, server-side quantity/state validation, ledger append, position version update, audit and outbox. Deterministic lock ordering prevents deadlocks for transfers. Constraints prevent duplicate source commands and negative controlled balances. On conflict, retry only safe transient failures; never silently oversell/overissue. Correctness takes priority over availability.

Reservations are aggregates with lifecycle/version, not negative ledger rows. Expiry/FEFO recommendations do not reserve until a command succeeds. Offline clients submit stable command IDs and receive authoritative success/replay/conflict.

## Lots and policy

An InventoryLot identifies item, tenant, supplier/source, lot code, manufacture/expiry, quality status and traceability identity; quantity is derived by location/state. Lot/expiry is required according to Item policy. FEFO/FIFO is an operational pick recommendation. Weighted-average or FIFO valuation is a distinct Finance policy; pick order never implies accounting valuation.

## Feed issue reference flow

```mermaid
sequenceDiagram
  participant W as Worker
  participant A as Application orchestration
  participant P as Poultry/Production
  participant I as Inventory
  participant F as Finance costing
  participant T as Traceability
  participant O as Outbox
  W->>A: Issue 500 kg Grower Feed, FEED-L24091, Store A -> BR-2609
  A->>P: Validate active flock/cycle and UOM
  A->>I: Lock position; validate lot/state/500 kg; append issue
  A->>P: Append consumption + FarmEvent
  A->>F: Register cost-source attribution
  A->>T: Link feed lot -> cycle
  A->>O: Record versioned consequences
  A-->>W: Committed result/current authoritative values
```

The same commit updates stock and records the authoritative consumption/cost/trace references. Post-commit consumers refresh FCR, plan variance, feed-days/reorder and analytics. A retry replays the original result.
