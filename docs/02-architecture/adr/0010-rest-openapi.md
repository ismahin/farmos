# ADR-0010 — REST and OpenAPI Business API

## Status
Accepted — 2026-09-22.

## Context
Web/mobile/integrations need a stable typed interface for resources and material business commands.

## Decision
Use JSON REST under `/api/v1`, explicit command subresources for non-CRUD transitions, generated OpenAPI as the executable contract, RFC 9457-style errors, cursor pagination, ETags, idempotency keys and correlation IDs. Generate the frontend TypeScript client from OpenAPI.

## Alternatives considered
- GraphQL primary API: flexible reads but extra authorization/cache/command complexity.
- gRPC primary external API: strong internal transport but weaker browser/public ergonomics.
- Handwritten frontend DTO client: drift risk.

## Consequences
Predictable ecosystem and documentation. Endpoint/schema compatibility and version governance are required; REST does not permit anemic-domain logic in endpoints.
