# M01 Execution Brief — Frontend Foundation / UX Prototype

> **Owner:** Antigravity  
> **Status:** PLANNED  
> **Dependency:** M00 COMPLETE  
> **Hard stop:** Do not begin M02.

## Required Reading

Read in this order:

1. `AGENTS.md`
2. `docs/08-project/CURRENT_STATE.md`
3. `docs/08-project/MILESTONES.md`
4. `docs/08-project/handoffs/M00.md`
5. `docs/01-product/MVP_SCOPE.md`
6. `docs/05-ui/INFORMATION_ARCHITECTURE.md`
7. `docs/05-ui/USER_FLOWS.md`
8. `docs/05-ui/SCREEN_REGISTRY.md`

Use the master blueprint when a product decision is unclear.

## Objective

Create a coherent, responsive, frontend-only FarmOS prototype and reusable UI foundation so the product can be validated visually before Codex freezes backend/domain architecture.

## Implementation Scope

- initialize `apps/web` using Next.js + TypeScript
- establish clear frontend folder conventions
- establish reusable design tokens/components (typography, spacing, surfaces, form controls, status patterns)
- build responsive global application shell/navigation
- use typed mock auth/tenant/farm context only
- build representative mock pages for Home, Today, Farms, Production, Stock, Purchasing, Sales, Money, Analytics, AI Assistant
- prototype onboarding:
  `Signup → Organization → Farm → Poultry/Broiler → Houses → Warehouse → Farm dashboard`
- prototype tree/list Farm Composer; do not require a visual canvas/map
- prototype representative poultry views (directory/control/fast-log) only to the depth needed to validate IA/interaction patterns
- use realistic mock data with clear separation from calculations/business truth

## Explicit Non-Goals

Do **not**:

- implement backend APIs/services
- create production DB schemas/migrations
- implement real auth/security/tenant isolation
- implement authoritative inventory/accounting/KPI formulas in frontend
- implement Hermes/MCP execution
- introduce microservices/infrastructure
- invent backend contracts and present them as final
- start M02

## UX Requirements

- responsive on representative mobile/tablet/desktop widths
- low-input/context-aware interaction patterns
- clear loading/empty/error/permission placeholders even when mocked
- capability/role-adaptive navigation structure
- accessible semantic controls and keyboard-friendly interactions where practical
- distinguish current stock from forecast/expected production in any mock display
- label mock/demo values clearly in developer-facing code/data

## Exit Checklist

- [ ] app boots cleanly
- [ ] navigation and representative pages work
- [ ] onboarding prototype works end to end with mock state
- [ ] Farm Composer list/tree flow works
- [ ] representative poultry/stock/commercial screens demonstrate consistent design patterns
- [ ] no backend/domain authority is embedded in client code
- [ ] browser checks performed at representative viewport sizes
- [ ] UI docs updated if structure changed
- [ ] `CURRENT_STATE.md`, `MILESTONES.md`, `BACKLOG.md`, `KNOWN_ISSUES.md` updated
- [ ] `handoffs/M01.md` created
- [ ] M01 marked COMPLETE, M02 identified as next
- [ ] work stops

## Suggested Completion Report

Report only:
- what was implemented
- what was browser-verified
- files/areas changed
- known issues/assumptions
- any API/domain needs discovered for M02
- confirmation that M02 was not started
