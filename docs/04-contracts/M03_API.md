# M03 Implemented API Contract

> **Status: Authoritative implementation contract (M03).** Runtime OpenAPI at `/api/docs` is generated from NestJS metadata.

All routes are under `/api/v1`. Protected routes accept either `Authorization: Bearer <opaque-session-token>` for non-browser clients or the M03B HttpOnly session cookie for browsers. Tenant identity is resolved from that server-side session; no tenant-selection header, query parameter, request field, or farm selection is authoritative.

| Method | Route | Access / behavior |
|---|---|---|
| POST | `/auth/register` | Public only with configured one-time/bootstrap secret in `X-Bootstrap-Token`; creates tenant owner atomically. |
| POST | `/auth/login` | Public. Default transport returns an opaque revocable token. `X-Session-Transport: cookie` sets the browser cookie and omits the token from JSON. |
| POST | `/auth/logout` | Authenticated; revokes the current server session and clears the browser cookie. |
| GET | `/me` | Authenticated safe user/tenant summary, effective permissions, and accessible farm scope. |
| POST | `/organizations` | `organization.manage`; requires `Idempotency-Key`. |
| GET | `/organizations/{id}` | `organization.read`; returns ETag. |
| PATCH | `/organizations/{id}` | `organization.manage`; requires `If-Match`. |
| POST | `/farms` | `farm.create`; requires `Idempotency-Key`. |
| GET | `/farms` | `farm.read`; cursor/page-size bounded and farm-assignment scoped. |
| GET | `/farms/{id}` | `farm.read` plus farm scope; returns ETag. |
| PATCH | `/farms/{id}` | `farm.update` plus farm scope; requires `If-Match`. |
| GET/POST | `/users` | `users.read` / `users.manage`. |
| POST | `/users/{id}/role-assignments` | `roles.manage`. |
| POST | `/users/{id}/farm-assignments` | `users.manage`. |
| GET | `/roles` | `roles.read`. |
| GET | `/audit` | `users.read`; bounded read-only audit view. |
| GET | `/health/live`, `/health/ready` | Public health probes; readiness verifies PostgreSQL. |

Failures use `application/problem+json` with stable code, safe message, request instance, and correlation ID. Every response includes `X-Correlation-Id`; only syntactically safe supplied correlation IDs are retained. `PATCH` uses numeric version ETags and returns 412 on stale writes. Creation replay uses PostgreSQL-backed idempotency records and returns conflict if a key is reused with different input.

Opaque session tokens are returned only for the default non-browser login/registration transport and stored only as SHA-256 hashes. Cookie transport never exposes the token to browser JavaScript. Passwords use Argon2id. Cookie-authenticated unsafe methods require an exact configured `Origin`; credentialed CORS is allowlist-only. See `M04_AUTH_INTEGRATION.md` for the browser contract.
