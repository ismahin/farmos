# Local Development

## Prerequisites

- Node.js 24 LTS and npm
- Docker with Compose

## First start

```powershell
npm ci
docker compose up -d postgres
$env:DATABASE_URL = "postgresql://farmos_migrator:local-migrator-only@localhost:5432/farmos"
npm run db:migrate
$env:DATABASE_URL = "postgresql://farmos_app:local-dev-only@localhost:5432/farmos"
$env:BOOTSTRAP_TOKEN = "replace-with-a-long-one-time-bootstrap-secret"
$env:WEB_ORIGINS = "http://localhost:3000"
npm run dev:api
```

The committed credentials are local-development-only. Docker initialization provisions a DDL owner and a separate `farmos_app` login inheriting the `NOLOGIN`, `NOBYPASSRLS` runtime group. Production must provision unique secrets through its secret manager and run migrations with a separate DDL identity.

The API listens on port 3001 by default. OpenAPI UI is `/api/docs`; liveness and readiness are `/api/v1/health/live` and `/api/v1/health/ready`.

Browser authentication uses an HttpOnly `farmos_session` cookie. It is intentionally not `Secure` under local HTTP, while production always enables `Secure` and requires HTTPS entries in `WEB_ORIGINS`. Browser requests use `credentials: "include"`; unsafe cookie-authenticated requests are accepted only from an exact configured Origin.

## Verification

```powershell
npm run lint
npm run typecheck
npm run test
npm run test:api:integration
npm run test:e2e --workspace=apps/api
npm run build
```

Integration/E2E tests start disposable real PostgreSQL instances. `drizzle-kit push` is not an approved production workflow. To reset only the named local Compose database, use `docker compose down -v`, then repeat first start; this destroys that local volume.

Bootstrap registration requires `X-Bootstrap-Token`. Rotate or remove `BOOTSTRAP_TOKEN` after controlled onboarding in a deployed environment. Do not place real tokens or database credentials in committed environment files.
