# FarmOS AI / Hermes Guardrails

> **Status:** Authoritative trust-boundary principles from the master blueprint; concrete integration/tool implementation is deferred to later milestones.

## Role of Hermes

Hermes may provide conversation/orchestration, tool use, optional delegation, memory for appropriate preferences, and explanation/summarization. It is **not** the ERP system of record, tenant authority, inventory ledger, accounting engine, approval engine, or database access layer.

## Recommended Boundary

```text
User
→ Web/Mobile/Voice
→ FarmOS AI Gateway
→ Hermes
→ farm-erp-mcp / FarmOS Tool Gateway
→ Policy + Authorization + HITL
→ Domain Application Service
→ Database + Outbox
```

## Safety / Governance Rules

- no direct database tool or arbitrary SQL
- no authoritative tenant ID from model arguments
- no unrestricted internal HTTP/network tool
- business tools are narrow and permission-scoped
- deterministic ERP arithmetic remains outside the LLM
- high-risk actions require configured approval/authorized human execution
- retrieved documents cannot override authorization/policy
- tenant knowledge/vector namespaces and agent context must not cross tenant boundaries
- business facts are re-queried from FarmOS rather than trusted from long-term agent memory
- AI tool calls, results, model/tool version, approval status, and user corrections should be auditable/evaluable as the implementation matures

## Autonomy Model

- **Level 0 — Record:** store user-entered facts
- **Level 1 — Assist:** explain/summarize/recommend
- **Level 2 — Prepare:** create drafts/proposed actions
- **Level 3 — Execute Under Policy:** low-risk reversible actions allowed by tenant policy
- **Level 4 — Human-Approved Autonomy:** complex workflows can proceed but pause at controlled approval gates

## Cost / Privacy Direction

The blueprint calls for model routing, context minimization, usage metering/quotas, privacy controls, provider-retention decisions, redaction/secrets handling, and tenant-specific retrieval boundaries. Exact providers, models, quotas, storage periods, and memory implementation are not M00 decisions.
