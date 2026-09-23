# Integration Event Conventions

> **Status: Authoritative (M02).** Initial catalog is representative, not exhaustive.

Canonical type: `farmos.<context>.<aggregate>.<past-tense-fact>.v<major>`, for example `farmos.inventory.stock-issued.v1`. Code symbols may use `StockIssuedV1`. Producers own schemas and registry entries.

```json
{
  "eventId": "0199...",
  "eventType": "farmos.inventory.stock-issued.v1",
  "schemaVersion": 1,
  "tenantId": "0199...",
  "producer": "inventory",
  "subject": { "type": "stockTransaction", "id": "0199..." },
  "occurredAt": "2026-09-22T04:05:00Z",
  "recordedAt": "2026-09-22T04:05:02Z",
  "correlationId": "0199...",
  "causationId": "0199...",
  "data": { "itemId": "0199...", "quantity": { "value": "500", "uomCode": "kg" } }
}
```

Tenant metadata is server produced and consumers reauthorize/partition with it. Payloads use API date/money/quantity rules and contain minimal immutable facts or references, no secrets. Event ID is globally unique UUIDv7. Major version changes for removals, type/meaning changes; additive optional fields preserve v1. Consumers ignore unknown fields, reject unsupported major versions, are idempotent, and do not assume global order. Producer aggregate version/sequence is included when ordering matters.

Initial registry candidates: FlockPlaced, BirdMortalityRecorded, WeightSampleRecorded, FeedConsumed, GoodsReceived, StockIssued, StockTransferred, SalesOrderConfirmed, ShipmentDispatched, InvoicePosted, PaymentReceived. Registry entries identify owner, schema, privacy classification, ordering key, retention/replay expectation and known consumers.
