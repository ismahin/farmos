# Production Operational Events

> **Status: Authoritative (M02).** This journal complements domain tables; FarmOS is not fully event sourced.

`FarmEvent` is append-only evidence of a physical/operational fact with: UUIDv7 event ID, tenant/organization/farm, optional cycle, entity type/ID, controlled event type/version, occurred/recorded timestamps, actor/source type and ID, optional quantity+UOM, typed references, controlled metadata JSONB, correlation/causation, and idempotency/source-event key.

Source types include Manual, Mobile, Voice, QR/Barcode/RFID, Sensor/Device, Import/API, OCR, AIExtracted/AIInferred, Calculated, and System. AI-derived facts retain source evidence, model/version, confidence, and verification status.

Rules:

- Domain-specific tables (Mortality, WeightSample, StockTransaction) remain authoritative for invariants and efficient current queries; FarmEvent is written in the same transaction.
- `occurred_at` describes the farm event; `recorded_at` is trusted server receipt. Future/source timestamps may be rejected or flagged by policy.
- Quantity is never unitless; metadata cannot replace indexed core facts.
- Corrections append a correcting/superseding event referencing the original. They never rewrite history.
- Current state may be materialized (for example live bird count) and must reconcile to placement, mortality, cull, transfer and harvest facts.
- FarmEvent is distinct from a domain event (in-process consequence), integration event (outbox contract), and audit record (security/change evidence), though they share correlation.

Initial controlled types include FlockPlaced, BirdMortalityRecorded, BirdCulled, WeightSampleRecorded, FeedConsumed, WaterConsumed, VaccinationAdministered, HarvestRecorded, GoodsReceived, StockIssued, and ProductionOutputRecorded.
