# FarmOS Operations / DevOps / SRE Guardrails

> **Status:** M00 working guardrails. Concrete hosting vendor, topology, CI implementation, SLOs, backup retention, RPO/RTO, and data-retention periods are later engineering/operations decisions.

## M02A Runtime Baseline

The authoritative application baseline is Node.js 24 LTS with strict TypeScript, NestJS and PostgreSQL. Local/CI environments pin the Node major (for example through `.nvmrc`/Volta/Corepack-compatible metadata selected in M03), use a locked package manager dependency graph, and run reviewed Drizzle SQL migrations with a privileged migration role distinct from the runtime role. Exact local commands and containers belong in `LOCAL_DEVELOPMENT.md` when M03 creates the backend; M02A creates no runtime scaffold.

## Environments

The master blueprint requires at minimum:

- local
- development
- staging
- production

Separate databases, object buckets, credentials, keys, queues, and relevant AI endpoints by environment. Do not casually copy production customer data into development; prefer synthetic/anonymized data.

## CI/CD Direction

The intended pipeline includes, as applicable:

1. formatting, ESLint and TypeScript strict checks
2. Vitest unit and architecture tests
3. static/dependency/security analysis
4. build
5. Testcontainers-backed PostgreSQL integration/tenant-isolation tests
6. migration validation
7. container/image scan when containers are used
8. deploy staging
9. E2E/smoke
10. approval policy
11. production deployment
12. health verification and rollback support

Use backward-compatible migrations for rolling deployments where relevant.

## Backup / DR Direction

FarmOS requires:

- automated database backups
- point-in-time recovery capability where supported by the deployment
- encrypted backups
- object versioning where appropriate
- tested restore procedures
- documented runbooks and ownership
- tier/phase-specific RPO and RTO chosen according to service level and budget

M00 intentionally does **not** set numerical RPO/RTO values, backup-retention periods, or geographic replication requirements.

## Observability

Use OpenTelemetry or equivalent vendor-neutral telemetry for traces, metrics, and logs. Correlate requests, commands, workflows, tool calls, and events while avoiding sensitive-data leakage.

Operational signals should eventually include:
- API latency/error rate
- DB latency
- queue/outbox lag
- consumer failures
- sync failures
- workflow backlog
- IoT ingestion lag when IoT exists
- AI/tool latency/failure
- approval latency
- document extraction failures

SLO values are defined later, not assumed in M00.

## Scalability / Reliability Direction

Start simple: stateless API, pooling, indexes, background jobs, cache/object storage/queue/read projections as justified. Avoid premature Kafka, Kubernetes, dozens of services, or a warehouse/lakehouse before workload evidence exists.

Use appropriate reliability patterns such as idempotency, retries/backoff, timeouts, dead-letter handling, optimistic concurrency, outbox, correlation IDs, health checks, and graceful degradation. Stock and financial correctness takes priority over maximizing availability during conflicting writes.
