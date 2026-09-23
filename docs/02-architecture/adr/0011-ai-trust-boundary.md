# ADR-0011 — FarmOS-Owned AI Tool Trust Boundary

## Status
Accepted — 2026-09-22.

## Context
Hermes provides useful reasoning/orchestration but model output and retrieved text are untrusted and cannot own tenant, approval or ledger authority.

## Decision
Route AI through FarmOS AI Gateway -> self-hosted Hermes -> FarmOS-owned MCP/tool gateway -> policy/auth/HITL -> ordinary domain application service. Tools are narrow, schema-versioned, authenticated outside arguments, idempotent and audited. No arbitrary SQL/internal HTTP/filesystem, tenant override, unrestricted posting or privilege tool.

## Alternatives considered
- Direct database/HTTP tools: rejected due to authorization, injection and invariant bypass.
- Put all AI inside ERP modules: couples model runtime to truth and reduces replaceability.
- No AI boundary until M20: rejected because early contracts could create unsafe assumptions.

## Consequences
Hermes/model providers remain replaceable and ERP correctness remains deterministic. Gateway/tool policy and evaluation add implementation work in later milestones.
