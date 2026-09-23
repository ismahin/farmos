# ADR-0002 — ASP.NET Core 10 Backend

## Status
Superseded by ADR-0013 — 2026-09-22.

> Historical record: this decision was accepted during M02 and was replaced by explicit project-owner direction in M02A. It is no longer authoritative for implementation.

## Context
FarmOS needs a maintainable, domain-heavy, transactional modular monolith with PostgreSQL, policy authorization, OpenAPI, background work and strong testing. The blueprint shortlisted ASP.NET Core and Spring Boot.

## Decision
Use C# on ASP.NET Core/.NET 10 LTS for the API and application workers; EF Core 10 + Npgsql for persistence/migrations, with module-owned SQL where locking/projections require it. Use built-in DI/auth/policy/OpenAPI/health facilities and xUnit integration tests against PostgreSQL. Keep package/framework additions minimal and centrally pinned.

## Evaluation

| Criterion | ASP.NET Core assessment |
|---|---|
| Domain-heavy ERP/modularity | Strong C# type system, project boundaries and domain modeling without requiring a large framework. |
| Transactions/PostgreSQL | Mature EF Core unit-of-work plus Npgsql and direct SQL escape hatch for locks/RLS/projections. |
| Authorization/security | Built-in authentication and composable policy authorization suit RBAC + contextual ABAC. |
| Testing/background work | In-process test host, xUnit ecosystem and hosted services support monolith/worker testing. |
| OpenAPI/performance | First-party OpenAPI support and efficient async cross-platform runtime. |
| Maintainability/complexity | Smaller required framework surface than the evaluated Spring stack; explicit architecture rules prevent accidental magic. |
| AI coding-agent effectiveness | Conventional typed solution/project structures and compiler feedback make changes mechanically verifiable. |
| Deployment | Single self-contained/containerized Linux application plus PostgreSQL; no application server required. |

## Alternatives considered
- **Java/Spring Boot:** equally viable for ERP, but a broader framework/dependency surface and more convention choices for this small team; rejected as the single authoritative stack.
- **TypeScript backend:** frontend language reuse, but not one of the blueprint’s evaluated primary options and offers less advantage for the domain/transaction core.

## Consequences
Strong types, async/runtime performance, mature transactions/authorization/tooling and simple containers. The team must maintain .NET expertise, patch supported versions, prevent EF models crossing module ownership, and use PostgreSQL-specific locking/RLS deliberately. .NET 10 is LTS and was active when frozen; upgrades require an ADR/update plan.

## References

- Microsoft .NET support policy: https://dotnet.microsoft.com/en-us/platform/support/policy
- ASP.NET Core OpenAPI overview: https://learn.microsoft.com/aspnet/core/fundamentals/openapi/overview?view=aspnetcore-10.0
