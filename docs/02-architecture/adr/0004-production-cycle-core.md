# ADR-0004 — ProductionCycle as Common Production/Economic Core

## Status
Accepted — 2026-09-22.

## Context
Poultry, fisheries, crops and grouped livestock share a time-bounded plan-to-output/cost concept; isolated vertical models would duplicate integration.

## Decision
Production owns `ProductionCycle`, lifecycle, production unit occupancy, blueprint snapshot, common events/inputs/outputs and economic attribution identity. Poultry and future vertical modules specialize through their own aggregates referencing the cycle. A started cycle retains an immutable resolved blueprint snapshot.

## Alternatives considered
- Separate Flock/FishCycle/CropCycle roots without common core: rejected due to duplicate inventory/cost/trace contracts.
- One giant polymorphic cycle/EAV record: rejected because vertical invariants need typed models.

## Consequences
Shared workflows and profitability dimensions with vertical rigor. Common Production must remain free of poultry-specific fields, and cross-module orchestration is required.
