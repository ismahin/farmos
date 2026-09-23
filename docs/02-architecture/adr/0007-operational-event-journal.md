# ADR-0007 — Relational State plus Operational Event Journal

## Status
Accepted — 2026-09-22.

## Context
FarmOS needs historical physical-event provenance while retaining practical relational queries and typed vertical invariants.

## Decision
Keep current aggregate state and domain transaction tables, plus append-only `FarmEvent`; retain separate inventory ledger, financial journal, audit log and integration events. Do not event-source every aggregate. Corrections append/supersede and current state must reconcile to facts.

## Alternatives considered
- Full event sourcing: rejected for implementation/query/migration complexity.
- Current state only: rejected for provenance, traceability and correction needs.

## Consequences
Useful history and analytics without universal replay, but similarly named event concepts require clear ownership and correlation.
