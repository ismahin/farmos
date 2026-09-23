# ADR-0013 — TypeScript, Node.js and NestJS Backend

## Status

Accepted — 2026-09-22. Supersedes ADR-0002.

## Context

After M02, and before backend implementation, the project owner changed the required backend language from C#/.NET to TypeScript on Node.js with NestJS. FarmOS still needs a domain-heavy modular monolith, strict tenant isolation, PostgreSQL transactions/RLS, explicit module boundaries, OpenAPI, background work and strong automated tests. All language-independent M02 decisions remain authoritative.

A common TypeScript language across Next.js and the backend reduces context switching and supports shared engineering conventions, while API DTOs remain generated from OpenAPI rather than imported across trust boundaries. NestJS supplies explicit modules, dependency injection, guards, interceptors, validation integration and OpenAPI support suitable for a modular application. Its structure is familiar to coding agents and both Codex/Antigravity workflows, while remaining deployable as one Node.js process/container.

## Decision

Use:

- Node.js 24 LTS, kept current on supported security patches; upgrade within supported LTS lines through normal dependency maintenance.
- TypeScript with `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and project references/path rules where useful.
- NestJS for the REST API, dependency injection, module composition, authentication/authorization guards, validation/error filters, OpenAPI and lifecycle/health integration.
- Drizzle ORM with the `pg` (`node-postgres`) driver for typed PostgreSQL schema/query access; Drizzle Kit generates version-controlled SQL migrations.
- Module-owned repositories and transaction services; domain/application layers do not import Drizzle schemas or driver types.
- OpenTelemetry JavaScript instrumentation for HTTP, PostgreSQL, logs/traces/metrics correlation.

Production schema changes use generated-and-reviewed SQL migrations committed to the repository. `drizzle-kit push` is not a production deployment mechanism. Hand-authored SQL inside migrations is required where PostgreSQL features are not completely represented by the schema DSL, including runtime/migration roles, `FORCE ROW LEVEL SECURITY`, policies/functions, grants, specialized constraints/indexes and safe data migrations.

Normal queries use Drizzle's typed query builder. Advanced operations use Drizzle's parameterized `sql` template or a transaction-scoped `pg` client behind the same module repository for `SET LOCAL app.tenant_id`, explicit isolation, `SELECT ... FOR UPDATE`, advisory locks and PostgreSQL-specific statements. Raw string concatenation with untrusted values is forbidden. ORM and explicit SQL share the same checked-out transaction connection so tenant context and atomicity cannot split.

## ORM/data-access evaluation

| Criterion | Prisma | MikroORM | Drizzle |
|---|---|---|---|
| PostgreSQL/transactions | Strong typed client and transaction API; advanced behavior often needs raw/query-builder escape hatches. | Strong PostgreSQL driver, Unit of Work and explicit transactions. | PostgreSQL-first schema/query primitives and explicit transaction/isolation API. |
| Modular-monolith boundaries | Generated client tends toward a central persistence surface unless heavily wrapped. | Entity managers can be module scoped, but identity-map/entity relationships can encourage cross-module coupling. | Small module-owned schemas/repositories compose without a global domain entity graph. |
| Migrations/constraints | Productive migration tooling; specialized DDL needs custom operations/raw SQL. | Mature transactional migrations and raw SQL; rich entity metadata. | Versioned generated SQL is transparent/reviewable; composite constraints/indexes are close to SQL. |
| RLS/tenant context | Supported through migration/raw SQL, but request transaction/context plumbing remains custom. | Strong native RLS metadata and transaction-scoped session context. | Native PostgreSQL RLS policy definitions plus direct parameterized SQL; transaction wrapper remains explicit and auditable. |
| Locks/specialized SQL | Possible through raw SQL. | Query builder/raw SQL available. | SQL-like query builder and parameterized SQL are first-class, well suited to locks and PostgreSQL features. |
| Domain fit/testability | Excellent CRUD ergonomics, but abstraction can obscure the exact tenant/locking SQL FarmOS must review. | Best rich ORM/Unit-of-Work option, but adds persistence lifecycle semantics FarmOS domain aggregates need not inherit. | Thin, predictable data mapper/query layer; repositories keep domain models persistence-independent and SQL observable in tests. |

Drizzle is selected because FarmOS prioritizes explicit relational integrity, RLS, concurrency and auditable SQL over a rich entity graph. MikroORM is the strongest rejected alternative; its native RLS support is valuable, but the additional Unit-of-Work/identity-map model is not required. Prisma is not selected because FarmOS would rely frequently on escape hatches for advanced PostgreSQL behavior, reducing the benefit of its higher abstraction.

## Testing decision

- Vitest for unit tests, deterministic domain/security policy tests and lightweight architecture/import-boundary tests.
- Nest `@nestjs/testing` plus Supertest for API/E2E behavior.
- Testcontainers for Node.js with the same supported PostgreSQL major used locally/CI; no SQLite or ORM in-memory substitute for persistence, RLS, locking or tenant-isolation tests.
- Drizzle migrations run from empty and prior migration states in integration tests.
- ESLint restricted-import rules plus a small dependency-graph/TypeScript architecture test enforce module direction; introduce a larger architecture-test dependency only if these become insufficient.
- Integration suites cover transactions, constraints, RLS, idempotency/outbox/audit; dedicated negative suites cover tenant isolation and authorization.

## Alternatives considered

- Retain ASP.NET Core/.NET: technically strong, but explicitly rejected by project-owner language/platform direction.
- Java/Spring Boot: technically viable but does not meet the TypeScript requirement.
- Express/Fastify without NestJS: smaller runtime surface but would require FarmOS to assemble and govern module/DI/guard/OpenAPI conventions itself. NestJS may use its supported HTTP adapter without changing application boundaries.
- Full-stack shared runtime DTO packages: rejected across the API boundary; OpenAPI remains the authoritative client-generation contract.

## Consequences

Positive:

- One strict TypeScript language across frontend/backend improves maintainability and AI-assisted delivery.
- NestJS modules align with the modular-monolith boundary and thin-controller design.
- Drizzle keeps PostgreSQL DDL, tenant scoping, locks and query behavior visible and testable.
- Deployment remains one portable Node.js application/worker plus PostgreSQL.

Trade-offs:

- TypeScript types do not replace runtime validation or database constraints.
- Node.js request context must be implemented carefully; tenant state is always transaction-local in PostgreSQL, never a leaked pool/session global.
- Drizzle is deliberately thin, so repositories and transaction boundaries require explicit engineering discipline.
- CPU-heavy work must leave the request event loop for workers when such workloads are introduced.

## References

- Node.js release status: https://nodejs.org/en/about/previous-releases
- NestJS modules: https://docs.nestjs.com/modules
- NestJS OpenAPI: https://docs.nestjs.com/openapi/introduction
- NestJS testing: https://docs.nestjs.com/fundamentals/testing
- Drizzle transactions: https://orm.drizzle.team/docs/transactions
- Drizzle indexes and constraints: https://orm.drizzle.team/docs/indexes-constraints
- Drizzle row-level security: https://orm.drizzle.team/docs/rls
- Drizzle migrations: https://orm.drizzle.team/docs/migrations
