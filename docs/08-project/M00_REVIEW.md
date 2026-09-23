# M00 Documentation Review — Blueprint Alignment Audit

> **Review date:** 2026-09-22  
> **Reviewed artifact:** Initial generated M00 documentation package  
> **Reference:** `docs/00-master/FarmOS_Master_Blueprint.md`

## Overall Assessment

The initial M00 package was structurally strong: it created the requested knowledge hierarchy, agent rules, product scope, UI artifacts, project-state files, and a useful milestone roadmap. It was **not safe to use unchanged**, however, because several documents promoted illustrative or future decisions into authoritative requirements before M02.

This review corrects those issues while retaining the useful structure.

## Major Findings and Corrections

| Area | Initial issue | Correction |
|---|---|---|
| Master blueprint | Two identical copies were stored under different names. | Keep one canonical file: `FarmOS_Master_Blueprint.md`. |
| Frontend direction | M01 alternated between React/Vite and the previously planned Next.js approach. | Standardize M01 on frontend-only Next.js + TypeScript; backend remains unfrozen. |
| Backend stack | Docs referenced Node/Go/Python despite the blueprint listing ASP.NET Core or Java/Spring as pragmatic examples and instructing team-fit evaluation. | Remove the unsupported list; M02 chooses via ADR. |
| Farm Composer | Mandatory visual drag/drop canvas was placed in MVP. | Tree/list mode is the MVP baseline; visual layout/map is later. |
| SSO | Login screen treated SSO as an MVP feature. | Email/password can be initial; enterprise SSO is later unless requirements bring it forward. |
| Operational targets | Hard numbers for onboarding time, field counts, latency, traceability time, sync rate, RPO/RTO, retention, etc. were invented. | Remove numerical targets; define them in formal requirements/operations milestones. |
| Cloud/deployment | Cloudflare, RDS, multi-AZ, geographic backups were presented as chosen architecture. | Replace with vendor-neutral guardrails. |
| Database | UUIDv7/prefixed IDs, exact RLS SQL and physical table names were prematurely frozen. | Defer to M02 ERD/tenancy/migration design. |
| Events/MCP | Example names/payloads were presented as canonical schemas. | Keep conceptual field/tool requirements; exact schemas/versioning are later contracts. |
| UI | Weather widget, OCR for environmental readings, tax-invoice assumptions, and some logistics details were added without source support. | Remove or describe generically/configurably. |
| Alerts | Example mortality/feed thresholds became defaults. | Rules remain configurable; no hard-coded M00 thresholds. |
| Offline | SQLite/IndexedDB implementation was assumed. | Keep offline/idempotency requirement, defer client/store/sync technology. |
| Finance | Some wording implied a deeper/full GL/tax scope than MVP requires. | Keep finance-lite/AP/AR/cash/costing foundations sufficient for the eight-link proof. |

## What Was Already Good

- repository-as-memory / baton-pass concept
- `AGENTS.md` pre-flight/handoff discipline
- poultry-first MVP and eight-link commercial proof
- milestone split between Antigravity and Codex
- preservation of core tenant/AI safety boundaries
- low-input role-adaptive UX direction
- shared inventory/production/finance/traceability concept
- production-cycle-centered architecture
- emphasis on tenant isolation, audit, idempotency, deterministic arithmetic, and testability

## M00 Exit Verdict

**PASS after corrections.**

The documentation is now suitable to hand to Antigravity for M01. M01 should remain frontend-only. M02 must be the formal engineering architecture/specification milestone before backend implementation begins.
