# M03 Verification Record

> **Status:** Passed on 2026-09-22.

- Unit/architecture: UUIDv7 validity/order, fail-fast configuration, and static module rules.
- Real PostgreSQL integration: fresh migration, forced RLS, unfiltered cross-tenant SELECT denial, cross-tenant UPDATE/DELETE denial, guessed-ID denial, tenant-aware FK rejection, concurrent tenant transactions, and pooled connection context cleanup.
- API/E2E: tenant bootstrap, login, organization/farm creation, sequential and concurrent idempotent replay, key/payload conflict, cursor pagination, second-user role and farm assignment, farm-scope denial, permission denial, optimistic concurrency, second-tenant denial, header/body tenant injection rejection, audit/correlation, and disabled-user login denial.
- Tooling: strict TypeScript, ESLint, Nest build, and an explicit Node.js 24.21.0 compile verification.
- Existing M01 frontend: lint, typecheck, Jest tests, and production build.

Persistence-sensitive tests use Testcontainers PostgreSQL 17, never SQLite or an in-memory database.

## M03B rerun — 2026-09-23

Docker/Testcontainers recovered and the previously interrupted expanded M03 verification ran. Integration passed (1 file, 3 tests), and the full E2E configuration passed after correcting an authenticated-route guard edge case discovered by the rerun. M03B adds a dedicated real-PostgreSQL browser suite (1 file, 2 tests) covering cookie issuance/attributes, `/me`, CSRF/Origin, CORS credentials, logout and old-session denial, explicit expiry, disabled users, tenant-switch resistance, and cookie-authenticated farm scope. Unit/architecture now passes 3 files / 5 tests.
