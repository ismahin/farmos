# FarmOS Event Contract Guardrails

> **Status:** Conceptual M00 contract scaffold. Exact event names, JSON schemas, topic names, serializers, and versions are frozen by Codex during M02/M10 as appropriate.

## Purpose

FarmOS uses events as first-class integration interfaces without event-sourcing every aggregate. Business state and the outbox are committed transactionally; downstream consumers must be idempotent and traceable.

## Common Event Information

The master blueprint identifies a normalized operational event journal with fields conceptually equivalent to:

```text
EventId
TenantId
OrganizationId
FarmId
ProductionCycleId
EntityType
EntityId
EventType
OccurredAt
RecordedAt
ActorType
ActorId
SourceType
SourceId
Quantity
Unit
Metadata
CorrelationId
CausationId
IdempotencyKey
```

The exact transport envelope may add schema/version metadata when the event registry is designed.

## Representative Event Families

Production examples:
- FlockPlaced
- BirdMortalityRecorded
- BirdCulled
- WeightSampleRecorded
- FeedConsumed
- WaterConsumed
- treatment/vaccination-related events as modeled
- Harvest events

Supply-chain examples:
- GoodsReceived
- StockIssued
- StockTransferred
- StockAdjusted
- QualityHoldPlaced / StockReleased
- StockDisposed

Commercial examples:
- SalesOrderConfirmed
- ProductAllocated
- ShipmentDispatched
- DeliveryConfirmed
- InvoicePosted
- PaymentReceived

## Publication Requirements

When event publication is implemented:

- write business state and outbox record in one transaction
- include correlation/causation IDs
- version schemas deliberately
- make consumers idempotent
- support retry/dead-letter handling
- maintain an event registry with producers and consumers
- never expose cross-tenant event data to a consumer without authorized/scoped context

## M02/M10 Deliverables Still Required

- naming convention
- versioning convention
- formal envelope schema
- event registry
- producer/consumer ownership
- broker/transport decision if one is needed at that stage
- compatibility policy
