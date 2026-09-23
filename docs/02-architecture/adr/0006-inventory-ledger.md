# ADR-0006 — Append-Only Shared Inventory Ledger

## Status
Accepted — 2026-09-22.

## Context
Stock must withstand retries/concurrency, provide lot genealogy and reconcile current positions without mutable-history ambiguity.

## Decision
Inventory owns an append-only transaction ledger and rebuildable/current position projection. Explicit commands, row-level locks, server validation, idempotency and constraints prevent negative/double stock. Corrections use reversals/adjustments. Reservations are explicit aggregates. Picking policy is separate from accounting valuation.

## Alternatives considered
- Mutable quantity-only table: cannot explain/reconcile history.
- Full event sourcing for all inventory aggregates: unnecessary complexity.
- Per-vertical inventory: duplicate authority.

## Consequences
Reliable audit/reconciliation and concurrency at the cost of more orchestration, projection and correction discipline.
