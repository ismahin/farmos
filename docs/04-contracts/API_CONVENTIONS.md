# REST / OpenAPI Conventions

> **Status: Authoritative (M02).** Endpoint sketches are contracts for later implementation, not implemented APIs.

## Resources and commands

JSON over HTTPS under `/api/v1`. Resource nouns are plural kebab-case; JSON is camelCase; enums are stable uppercase strings. CRUD-shaped lifecycle changes use explicit command subresources, for example `POST /production-cycles/{id}/start` and `POST /poultry/flocks/{id}/mortality`. Creation returns `201` + `Location`; successful commands return `200/201/202` with the affected resource/operation, not an unverified optimistic value; deletion uses `204` only where deletion is semantically valid.

Representative contracts:

```text
POST /api/v1/farms                 GET /api/v1/farms/{id}
POST /api/v1/production-cycles     GET /api/v1/production-cycles/{id}
POST /api/v1/poultry/flocks/{id}/mortality
POST /api/v1/poultry/flocks/{id}/weights
POST /api/v1/poultry/flocks/{id}/feed
GET  /api/v1/inventory/availability?itemId=&warehouseId=&asOf=
POST /api/v1/procurement/requisitions
POST /api/v1/sales/orders
```

The server derives tenant/user/session. Payloads do not contain authoritative `tenantId`; if exposed in a representation it is read-only.

## Representation rules

- IDs are lowercase canonical UUID strings; human codes are separate mutable/business identifiers.
- Date is ISO `YYYY-MM-DD`; instant is RFC 3339 UTC (`Z`). Source offset/timezone can be an additional field. `occurredAt` and `recordedAt` are distinct.
- Quantity is `{ "value": "500.000", "uomCode": "kg" }`; decimals are JSON strings at trust boundaries to preserve exactness.
- Money is `{ "amount": "1250.00", "currency": "USD" }`; never a float or implicit currency.
- Nullable/omitted semantics are schema-defined. Unknown enum values must fail safely; clients tolerate additive response fields.

## Collections

Cursor pagination: `pageSize` (server-capped), `cursor`; response `{ items, page: { nextCursor, hasMore } }`. Stable sort includes `id` as tiebreaker. Filters use named query parameters and allowlisted operators; sorting uses `sort=field,-other`. No arbitrary SQL/filter expressions. Offset pagination is limited to small administrative lists.

## Concurrency and retries

Mutable resources expose a strong version/ETag. Commands that depend on current state require `If-Match`; mismatch returns 412 `CONCURRENCY_CONFLICT`. Material POSTs require `Idempotency-Key`; replay metadata may be returned in headers. Idempotency does not bypass current authorization.

Every request accepts/receives `X-Correlation-Id` (server validates or replaces invalid values), and responses echo it. Trace context uses W3C headers. Rate-limit/retry headers are emitted where relevant. Never retry non-idempotent commands without a key.

## Authorization and OpenAPI

OpenAPI is generated from executable endpoint contracts, checked in/published during implementation, and used to generate a TypeScript client. Each operation documents authentication, permissions/scopes, entitlement, idempotency, concurrency and error codes. Object authorization is server-side and cross-tenant absence normally returns non-disclosing 404/403 according to policy.
