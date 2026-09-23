# FarmOS Current State

> **Last updated:** 2026-09-23  
> **Last completed milestone:** `M03B — Browser Authentication Bridge`  
> **Next milestone:** `M04 — SaaS UX Integration`  
> **Last completed milestone:** `M04 — SaaS UX Integration`  
> **Next milestone:** `M05 — Farm Composer UX`  
> **Next owner:** Antigravity

## Implemented

- M01 Next.js/TypeScript responsive frontend remains mock-backed and unchanged.
- M03 Node.js 24/NestJS strict-TypeScript modular-monolith backend in `apps/api`.
- Drizzle/`pg` persistence with reviewed migration `0000_m03_foundation.sql` for tenant, entitlement, identity/RBAC/session, organization/legal entity, farm/farm assignment, audit, idempotency, and transactional outbox foundations.
- Trusted opaque-session tenant resolution, Argon2id passwords, deny-by-default permissions, contextual farm assignments, transaction-local RLS context, forced PostgreSQL RLS, composite tenant integrity, audit/correlation, ETags, idempotency, Problem Details, OpenAPI, OpenTelemetry, and health probes.
- Real PostgreSQL Testcontainers coverage for fresh migrations, RLS and pool leakage, tenant constraints, authorization, idempotency/concurrency, audit, and the M03 golden API journey.
- M03B browser bridge: explicit cookie transport on login/register, HttpOnly/SameSite session cookie with production Secure enforcement, exact-Origin CSRF checks, credentialed allowlist CORS, cookie logout/revocation, and expanded safe `/me` identity/tenant/permission/farm scope.
- **M01**: Next.js 15 App Router / TypeScript responsive application shell, navigation, design tokens, and comprehensive mock journeys.
- **M03/M03B**: Node.js 24/NestJS strict-TypeScript modular-monolith backend in `apps/api` with Drizzle/PostgreSQL persistence, forced RLS, composite tenant integrity, trusted opaque session cookies (`HttpOnly`, `SameSite=Lax`, `Path=/api`), exact-Origin CSRF enforcement, credentialed allowlist CORS, OpenAPI documentation, RFC 9457 Problem Details, ETags, and Testcontainers coverage.
- **M04**: SaaS UX Integration in `apps/web`:
  - Real browser session flow: `POST /api/v1/auth/login` (with `X-Session-Transport: cookie`), `GET /api/v1/me`, and `POST /api/v1/auth/logout`.
  - Zero storage of auth tokens, passwords, or session secrets in `localStorage`, `sessionStorage`, or JavaScript-accessible memory.
  - Typed client layer in `apps/web/lib/api/` with `apiFetch`, `Idempotency-Key` headers, `If-Match` ETags, and RFC 9457 `ApiProblemError` mapping.
  - Central `AuthProvider` & `useAuth` hook managing authenticated session, user summary, tenant summary, effective permissions, and accessible farms.
  - `AuthGuard` providing loading skeleton during bootstrap, unauthenticated redirect to `/login`, and dismissible `403 Forbidden` banners displaying Problem Details correlation IDs without logging the user out.
  - Header updated to render authoritative tenant name, server-returned accessible farms dropdown (with `farm.create` permission check on compose link), real user info, authorized permissions list, and session revocation / sign out.
  - Operational Farms Directory (`/farms`) and farm detail (`/farms/[id]`) connected to real accessible farms with `EmptyState` fallbacks.
  - Enterprise Settings (`/settings`) connected to real M03 backend APIs:
    - **Organization tab**: `GET /api/v1/organizations/:id` and `PATCH /api/v1/organizations/:id` with `If-Match` ETag concurrency handling.
    - **Farms tab**: `GET /api/v1/farms`, `POST /api/v1/farms` with `Idempotency-Key`, and `PATCH /api/v1/farms/:id` with `If-Match` ETag concurrency.
    - **Users & Roles tab**: `GET /api/v1/users`, `POST /api/v1/users` (temporary password provisioning), `GET /api/v1/roles`, role assignments via `POST /api/v1/users/:id/role-assignments`, and farm assignments via `POST /api/v1/users/:id/farm-assignments`.
    - **Audit Log tab**: `GET /api/v1/audit` displaying immutable tenant mutation trail.
    - **Preferences & Alert Rules tabs**: preserved as workstation preferences prototypes.
  - Persona switching removed as an authentication mechanism; UI behavior is strictly gated by backend permissions (`organization.read`, `organization.manage`, `farm.read`, `farm.create`, `farm.update`, `users.read`, `users.manage`, `roles.read`, `roles.manage`).
  - Strict preservation of downstream mock modules: Production, Stock, Purchasing, Sales, Money, Analytics, and AI Assistant remain intact prototypes without regression.

## Authoritative implementation entry points

- API: `apps/api/src/app.module.ts`
- Database migration: `apps/api/drizzle/0000_m03_foundation.sql`
- Implemented routes: `docs/04-contracts/M03_API.md`
- Local setup: `docs/09-operations/LOCAL_DEVELOPMENT.md`
- Verification: `docs/06-testing/M03_VERIFICATION.md`
- Handoff: `docs/08-project/handoffs/M03.md`
- Browser integration contract: `docs/04-contracts/M04_AUTH_INTEGRATION.md`
- Latest handoff: `docs/08-project/handoffs/M03B.md`
- Web API Client: `apps/web/lib/api/`
- Web Auth Provider & Guard: `apps/web/components/shell/auth-context.tsx`, `apps/web/components/shell/auth-guard.tsx`
- Web Settings Integration: `apps/web/app/(erp)/settings/page.tsx`
- API Backend: `apps/api/src/app.module.ts`
- Implemented API contracts: `docs/04-contracts/M03_API.md`
- Browser auth integration contract: `docs/04-contracts/M04_AUTH_INTEGRATION.md`
- Latest handoffs: `docs/08-project/handoffs/M03B.md`, `docs/08-project/handoffs/M04.md`

## Deferred / known limitations

External identity and hosting vendors remain undecided. Bootstrap uses a configured deployment secret. Rate limiting, email verification, password reset, MFA, audit retention/export, an outbox publisher, Redis, and RabbitMQ are deferred. Production is expected to deploy web/API on the same HTTPS site; exact reverse-proxy/hosting configuration remains an operations decision. PostgreSQL 17 is the verified local/test baseline.
- Downstream modules (Production, Stock, Purchasing, Sales, Money, Analytics, AI Assistant) remain frontend mock prototypes until their dedicated milestones.
- M05 Farm Composer will introduce the tree/list composer for enterprise topology, production units (houses), warehouses, and production blueprints.
- Self-service public registration, password reset emails, MFA, and rate limiting remain deferred operational capabilities.
- Outbox event publisher and message broker (RabbitMQ/Redis) remain deferred.

No Enterprise, ProductionUnit, poultry, ProductionCycle, inventory, procurement, sales, finance, Hermes/MCP, IoT, analytics, or workflow implementation was started.

## Next work

Execute M04 only: follow `M04_AUTH_INTEGRATION.md` to integrate the existing frontend with the M03B cookie session, `/me`, organization, farm, user/role/farm-assignment, Problem Details, ETag, and idempotency contracts. Keep backend authorization authoritative and do not start M05.
- **M05 — Farm Composer UX** (Owner: Antigravity): Build the tree/list interactive farm composer UX covering enterprise selection, house capacities, storage facilities, and production blueprint selection without requiring a visual drag-and-drop canvas.
