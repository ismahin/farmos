# M01 to M03 Frontend Compatibility

> **Status: M04 input.** M03 did not modify or integrate the M01 frontend.

M04 must replace the mock persona/context with the cookie login plus `/api/v1/me`; mock organization onboarding with `/api/v1/organizations`; mock farm selection with `/me` scope and the bounded accessible-farms response from `/api/v1/farms`; and role switching with permission-derived UX. A selected farm remains presentation/query scope and is reauthorized by the backend.

Follow `M04_AUTH_INTEGRATION.md`, including `credentials: "include"`, `Origin`/CORS assumptions, 401/403 handling, and the rule against JavaScript-readable auth storage. Generate a client from `/api/docs`. Preserve server ETags for edits, stable idempotency keys for retried creates, correlation IDs in support UX, and Problem Details mapping. Never send or trust a UI-selected tenant ID. Clear tenant/session-scoped caches at logout. The existing mock operational, inventory, poultry, finance, analytics, approval, and AI screens remain prototypes until their owning milestones; M04 must not infer those APIs from M03/M03B.
