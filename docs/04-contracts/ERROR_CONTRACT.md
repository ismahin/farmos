# API Error Contract

> **Status: Authoritative (M02).** Compatible with RFC 9457 Problem Details, with FarmOS extensions.

Content type: `application/problem+json`.

```json
{
  "type": "https://api.farmos.example/problems/business-rule",
  "title": "Feed issue is not allowed",
  "status": 422,
  "code": "INVENTORY_INSUFFICIENT_AVAILABLE",
  "message": "The requested quantity is not available.",
  "correlationId": "0199...",
  "fieldErrors": [{ "field": "quantity.value", "code": "EXCEEDS_AVAILABLE", "message": "Requested quantity exceeds available stock." }],
  "details": { "itemId": "0199..." }
}
```

`message`, `fieldErrors`, and `details` are safe/user-facing only; no stack traces, SQL, secrets, tenant existence or internal identifiers. Clients branch on stable `code`, never localized text. Unknown fields/codes are tolerated.

| Category | HTTP | Examples |
|---|---:|---|
| Validation | 400 | `VALIDATION_FAILED` |
| Authentication | 401 | `AUTHENTICATION_REQUIRED` |
| Authorization | 403/404 | `ACTION_FORBIDDEN`, non-disclosing missing resource |
| Not found | 404 | `RESOURCE_NOT_FOUND` |
| Conflict/business lifecycle | 409/422 | `RESOURCE_CONFLICT`, `BUSINESS_RULE_VIOLATION` |
| Concurrency | 412 | `CONCURRENCY_CONFLICT` |
| Idempotency conflict | 409 | `IDEMPOTENCY_KEY_REUSED`, `COMMAND_IN_PROGRESS` |
| Feature entitlement | 403 | `FEATURE_NOT_ENTITLED` |
| Rate limit | 429 | `RATE_LIMITED` + safe retry hint |
| Internal/dependency | 500/503 | `INTERNAL_FAILURE`, `DEPENDENCY_UNAVAILABLE` |

Batch/import endpoints identify errors by stable row/item pointer but do not partially commit unless the operation contract explicitly supports it.
