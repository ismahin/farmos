# ADR-0012 — Generic Versioned Workflow and Approval Model

## Status
Accepted — 2026-09-22.

## Context
Purchasing, payments, discounts, stock changes, quality and medicine need configurable approvals without scattered thresholds.

## Decision
Use one Workflow context with versioned definitions/instances/decisions. Approval grants permission to attempt a typed action; the owning service revalidates before execution. Conditions/thresholds/approvers are effective-dated configuration, with scope and segregation of duties.

## Alternatives considered
- Hard-coded per-module approval chains: drift and poor configurability.
- External durable workflow engine immediately: premature dependency for MVP.
- Approval as a UI flag: insecure and non-auditable.

## Consequences
Consistent HITL/audit and future engine adaptability. A small internal state machine is sufficient initially; complex long-running orchestration may later justify Temporal or equivalent via a new ADR.
