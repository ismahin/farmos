# M01 Mock-to-Backend Mapping

> **Status: Authoritative migration map (M02).** M01 types/data remain **Provisional**.

| M01 surface | Current source | Authoritative replacement / milestone |
|---|---|---|
| Login/signup/persona switch | Client state and timed success | M03 authentication, Session, tenant membership, role/permission and effective-principal endpoint |
| Organization/farm selection | `ShellProvider`, `mockOrganization`, `mockFarms` | M03 Organization/Farm queries; selected farm remains UI context but server reauthorizes FarmAssignment |
| Onboarding activation | Local wizard state | M03 organization/farm draft foundations + M06 composer activation application service/workflow |
| Farm cards/capacity/severity | `types/tenant.ts`, `mocks/farms.ts` | Farm-owned topology plus M18 exception/read projection; do not persist UI aggregates on Farm |
| Production/flock/KPIs | `types/production.ts`, production mocks | M10 ProductionCycle/events + M11 Poultry facts + M18 versioned metric projections |
| Fast-log mortality/feed/weight | `FastLogModal` timed acknowledgement | Idempotent commands with server-resolved active cycle, authorization, concurrency, audit and consequences (M07/M10/M11) |
| Stock position/lots | inventory mocks | M07 immutable stock ledger, reservations, lots and availability projection |
| PR/PO approvals | local requisition state | M13 Procurement + versioned Workflow decisions |
| Sales/invoices | sales mocks | M14 Sales/Finance source transactions and authoritative status |
| Money/profitability | finance mocks/client formatting | M14 journals/cost attribution/P&L projections; no client arithmetic/implicit `$` |
| Alerts/tasks/analytics | static mocks | M18 deterministic rules, tasks, semantic metrics/read projections |
| AI chat/citations | `mocks/ai.ts` and timers | M20 authenticated AI gateway/Hermes/MCP read tools and evidence links |
| HITL proposal approve | client booleans | M22 durable proposal/workflow/approval then revalidated application command |
| Settings/team/capabilities | hard-coded rows/forms | M03 identity/org settings and backend entitlements; M04 integration |

The UI should introduce feature repositories/API adapters rather than importing `@/mocks` from pages. Replace one vertical slice at a time, mapping generated OpenAPI DTOs to existing view models. Backend resource shapes must follow domain contracts, not reproduce denormalized mock interfaces.
