# Frontend Integration Contract

> **Status: Authoritative direction (M02).** Query library selection is **Deferred** to M04.

The Next.js application shall consume a generated TypeScript client from the backend OpenAPI document, wrapped by small feature-specific adapters. Generated code is not edited manually. Domain API DTOs remain separate from view models where display aggregation differs.

Server components/loaders should fetch initial read data when authentication and caching permit; interactive forms use client components. The browser never constructs trusted tenant/user/role claims. A server-validated session endpoint supplies display identity, accessible farms and effective capabilities; selected farm is a UI/query scope that the backend reauthorizes on every call.

Query caching must include tenant/session and resource scope in keys, clear on logout/tenant switch, honor ETag/version, and avoid persisting sensitive responses casually. Mutations invalidate/reconcile from the server response. Optimistic UI is allowed only for reversible cosmetic/draft interactions; stock, finance, approvals, biological counts and lifecycle state display pending status until authoritative success/refetch.

Problem Details maps stable error codes to inline field errors, permission/entitlement states, concurrency refresh prompts, and idempotent replay status. Correlation ID is shown in support-ready error UI.

Offline field commands retain stable UUIDv7 command/idempotency key, occurrence time, payload schema version and sync state. Server conflicts are visible; the client does not locally merge material stock/finance/critical production facts.
