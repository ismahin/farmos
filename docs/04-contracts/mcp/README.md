# FarmOS MCP / Tool Contract Guardrails

> **Status:** M00 AI trust-boundary scaffold. Exact tool schemas and implementation are later deliverables (M20/M22), with security principles frozen earlier.

## Trust Boundary

```text
Authenticated user
→ FarmOS experience / AI gateway
→ Hermes
→ FarmOS-owned MCP/tool surface
→ policy + authorization + HITL
→ domain application service
→ transactional database + outbox
```

Hermes is replaceable orchestration. FarmOS owns truth, authorization, policy, transactions, audit, and approvals.

## Mandatory Tool Rules

Every action tool must eventually have:

- narrow purpose and strict schema
- validated business identifiers
- authenticated user context outside model arguments
- tenant context outside model arguments
- explicit versioning
- idempotency for applicable commands
- preview/dry-run where useful
- structured error/status results
- approval status where relevant
- audit/correlation context

Never expose to the model:

- arbitrary SQL
- raw database credentials
- unrestricted internal HTTP/network access
- unrestricted journal posting
- unrestricted tenant switching
- user/role privilege escalation
- unrestricted filesystem access to tenant data

## Tool Classes

Read examples:
- `get_farm_overview`
- `get_inventory_position`
- `get_flock_performance`
- `get_alerts`
- `get_pending_approvals`
- `get_profitability`

Draft/prepare examples:
- `create_purchase_request_draft`
- `create_sales_quote_draft`
- `create_task_draft`
- `create_stock_transfer_draft`
- `create_farm_draft`
- `create_production_cycle_draft`

Operational command examples:
- `record_mortality`
- `record_weight_sample`
- `record_feed_consumption`
- `complete_task`

Approval/high-risk examples normally enter approval policy rather than blindly executing:
- purchase-order approval
- stock write-off
- supplier payment
- price override
- disposal

## Risk/Autonomy Direction

- read/report/explain: generally automatic
- draft/prepare: generally automatic but not authoritative execution
- low-risk reversible actions: tenant-policy controlled
- high-risk financial/health/safety/destructive actions: human approval or explicit authorized workflow

Exact tool payloads, risk classifications, permission mapping, and transports are not frozen in M00.
