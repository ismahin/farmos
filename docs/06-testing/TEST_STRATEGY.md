# Architecture and Test Strategy

> **Status: Authoritative (M02).** Numerical coverage/performance targets are set only after executable baselines exist.

## Test layers

- **Unit:** aggregate lifecycle/invariants; permissions/policy; UOM conversion/rounding; money/costing/KPI formulas; workflow conditions; event mapping. Deterministic clock/ID abstractions.
- **Integration:** Nest application test host against a real supported PostgreSQL Testcontainer; migrations/constraints/RLS; transactions/rollback/locks; idempotency/concurrency; audit/outbox/inbox; module contracts; authentication/authorization; generated OpenAPI compatibility. Avoid SQLite, mocked repositories and in-memory DB substitutes for relational correctness.
- **End-to-end:** farm creation, cycle start, purchase-to-stock, feed issue, mortality/weight, harvest-to-sale, invoice-to-payment, close/profitability and trace path. Browser tests validate loading/empty/permission/error states when integration milestones arrive.
- **Architecture:** Vitest plus TypeScript import/dependency checks enforce package/module ownership, public entry points, no forbidden infrastructure imports in domains, no cross-module Drizzle schema/repository access and no controller business rules. ESLint restricted-import rules provide fast feedback.

## Tenant isolation suite

Generate two tenants with colliding human codes. For every read/mutation/export/event/job, prove Tenant A cannot access Tenant B by ID substitution, filters, nested IDs, idempotency keys or timing. Execute repository tests with application filtering deliberately omitted to prove RLS; reuse pooled connections across tenants. Extend to cache, object storage, search/vector, broker consumers and MCP as introduced.

## Critical correctness suites

- Concurrent issue/reservation cannot create negative available stock; retry cannot duplicate ledger/cost/outbox.
- Mortality/harvest cannot exceed live biological balance.
- Posted stock/journal/audit facts cannot be edited; reversals reconcile.
- Outbox crash windows yield at-least-once publication and exactly-once business effect through consumer inbox.
- Feed issue reconciles inventory, consumption, cost attribution, traceability, FarmEvent and event correlation.
- Unauthorized/expired/stale approvals and ETags fail safely.

## Pipeline and data

Pipeline order: format/ESLint, TypeScript build/typecheck, Vitest unit, architecture/static/security scan, migration validation, PostgreSQL integration/tenant-isolation, OpenAPI contract, Nest/Supertest E2E, frontend tests/build and smoke as available. Use synthetic factories; never copy production data casually. Test failures report correlation IDs without secrets.
