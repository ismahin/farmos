# ADR-0008 — Transactional Outbox and At-Least-Once Delivery

## Status
Accepted — 2026-09-22.

## Context
Database changes and asynchronous publication cannot be atomically committed through a distributed transaction.

## Decision
Write versioned integration events to PostgreSQL outbox in the business transaction. A hosted publisher sends at least once; consumers use transactional inbox/idempotency, retry/backoff and dead-letter operations. RabbitMQ is the initial broker only when asynchronous consumers justify it.

## Alternatives considered
- Publish directly after commit: crash window loses events.
- Distributed transactions: operationally excessive.
- Kafka by default: premature infrastructure.

## Consequences
Reliable propagation with duplicates/out-of-order possibilities that consumers must handle. Outbox lag/retry/DLQ require observability.
