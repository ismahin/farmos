# M01 Architecture Review

> **Status: Authoritative findings (M02).** Review is read-only; no M01 code was changed.

## Compatible

- Next.js/TypeScript responsive task-oriented shell and routes match product navigation.
- Types explicitly label themselves provisional; no production database/backend or hidden authoritative service exists.
- Farm Composer uses tree/list flow and review before simulated activation.
- Stock UI distinguishes on-hand/reserved/available/hold/incoming and shows lots/FEFO.
- Fast Log demonstrates inherited farm/house/flock context and capture-once messaging.
- AI proposal visibly describes HITL limits and citations; it does not call a model/database.

## Provisional

- All interfaces, IDs, enums, status sets, KPI/cost values and nested Farm/house/warehouse shapes are view models, not persistence/API contracts.
- Farm summary counts, current live birds, stock availability, days-of-supply, FCR, margins and alerts are future server projections.
- Enterprise/persona/role/category lists are prototype subsets; authoritative catalogs/permissions are backend-owned.

## Needs future change

- Pages import mock arrays directly; M04+ should use generated API client + feature adapters/query cache.
- `ShellProvider` permits unrestricted persona/farm switching and derives unread counts locally; replace with validated session/effective access and scoped queries.
- Fast Log searches global `mockHouses`, defaults to a fixed house/lot, performs only HTML validation, and shows success after a timer. Replace with context-scoped command, UOM, occurrence time, idempotency, ETag/conflict and standard error handling.
- Purchasing/AI approval buttons mutate client state only. Use durable workflow/approval resources; never optimistic-authorize.
- Currency rendering contains implicit `$` in places; use currency from authoritative Money and locale formatting.
- Detail routes fall back to the first mock record for unknown IDs; production must return a non-disclosing not-found/error state.
- Client-computed filters/derived dashboard figures need server projections and tenant-aware cache keys.

## Architecturally invalid

None in M01's declared frontend-only demonstrator scope. The client-only identity, mutation and calculations would be invalid if connected to production unchanged; they are clearly marked mocks and mapped above for replacement.

## Critical review result

The frozen architecture eliminates duplicate vertical inventory/accounting, prevents Poultry leakage into Production, distinguishes operational journal/audit/outbox, makes material commands atomic/idempotent/concurrency-safe, protects tenant context across all surfaces, and preserves future livestock/fisheries/crops through the common cycle/item/UOM model.
