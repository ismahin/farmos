# FarmOS Known Issues, Risks, and Open Decisions

> **Last reviewed:** M03B completion, 2026-09-23.
> **Last reviewed:** M04 completion, 2026-09-23.

## Active defects

None known in the M03B scope. Backend strict typecheck, lint, unit, architecture, real-PostgreSQL integration/API tests, and build pass. The M01 frontend remains functional and mock-backed.
None known in the M04 scope.
- Frontend: all 7 test suites (28 tests) pass, typecheck (`tsc --noEmit`) passes with 0 errors, ESLint passes with 0 warnings, and Next.js 15 production build passes with all 19 routes successfully generated.
- Backend: all Vitest unit and architecture tests pass without regression.

## Known limitations / deferred hardening

- M03B defines the browser cookie, Origin/CSRF, and CORS contract. M04 still owns client cache clearing, redirects, and generated OpenAPI client integration; it must not replace the cookie with JavaScript-readable storage.
- Downstream modules (Production, Stock, Purchasing, Sales, Money, Analytics, AI Assistant) remain frontend mock prototypes until their dedicated milestones (M07–M23).
- Farm Composer (M05/M06) will introduce the tree/list composer for enterprise topology, production units (houses), storage facilities, and production blueprints.
- Bootstrap is protected by a configured secret; deployment operations must rotate/remove it after controlled onboarding. Public self-service signup, invitations, email verification, password change/reset, MFA, lockout, and rate limiting are not implemented.
- Audit is append-only to the runtime role and guarded against update/delete, but retention, archival/export, privileged DBA controls, and cryptographic anchoring are later operational decisions.
- Outbox messages are stored atomically but deliberately unpublished. Redis and RabbitMQ remain deferred until justified.
- PostgreSQL 17 is verified for local/test. Production hosting, supported minor-version policy, backups, SLO/RPO/RTO, and secret management remain deployment decisions.
- OpenTelemetry auto-instrumentation is vendor-neutral and opt-in; collector/exporter deployment and production alerting are deferred.
- Production deployment must keep web and API same-site over HTTPS or formally revisit the cookie SameSite policy with an approved security review; unrestricted cross-site credential use is not supported.

## Expected M01 limitations

Authentication, personas, farms, mutations, approvals, operational data, AI, and HITL in M01 are demonstrations. M04 should follow `docs/04-contracts/M04_AUTH_INTEGRATION.md` and `M03_FRONTEND_COMPATIBILITY.md`; future-domain mocks stay provisional until their owning milestones.

## Risks to track

- `npm audit --omit=dev` reports one high and one moderate advisory in the existing Next.js 15 → bundled PostCSS chain; npm proposes a Next.js 16 major upgrade. M03 did not force that frontend framework migration. M04/M24 should upgrade with browser regression testing or apply an upstream-supported patched 15.x release when available.
- `npm audit --omit=dev` reports advisories in the Next.js 15 bundled PostCSS chain. Next.js major upgrade to 16 should be evaluated during hardening (M24) or upon stable patch availability.
- New tenant-owned tables must repeat the transaction-local tenant-context, forced-RLS, runtime-role, composite-integrity, and negative-test pattern established by M03.
- Cross-module Drizzle access must pass through intentional public persistence/application entry points and remain covered by restricted-import and architecture tests.
- Inventory/finance correctness later requires explicit locking, reversals, reconciliation, and stronger high-contention tests.
- AI prompt injection, tool authorization, tenant evidence isolation, and provider privacy remain M20/M24 concerns.
