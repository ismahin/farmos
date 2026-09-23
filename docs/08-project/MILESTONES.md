# FarmOS Milestones — Baton-Pass Roadmap

> **Statuses:** `PLANNED`, `IN_PROGRESS`, `BLOCKED`, `COMPLETE`

| ID | Milestone | Owner | Status | Exit outcome |
|---|---|---|---|---|
| M00 | Project Knowledge Base | Antigravity | `COMPLETE` | Shared repository memory, product/UX docs, governance, handoff protocol. |
| M01 | Frontend Foundation / UX Prototype | Antigravity | `COMPLETE` | Responsive Next.js shell and representative mock MVP journeys. |
| M02 | Technical Architecture Freeze | Codex | `COMPLETE` | SRS, bounded contexts, ERD, backend/tenancy/security/API/event/testing decisions and M03 handoff. |
| M02A | Backend Technology Amendment | Codex | `COMPLETE` | Supersede .NET choice with Node.js/TypeScript/NestJS and Drizzle/`pg`; preserve all language-independent M02 decisions. |
| M03 | SaaS Backend Foundation | Codex | `COMPLETE` | Tenant/organization/identity/RBAC/farm/audit foundations, migrations, OpenAPI and tenant-isolation tests. |
| M03B | Browser Authentication Bridge | Codex | `COMPLETE` | HttpOnly opaque-session cookie transport, Origin/CSRF and credentialed CORS policy, safe `/me`, and M04 integration contract. |
| M04 | SaaS UX Integration | Antigravity | `PLANNED` | Replace auth/org/farm/team/settings mocks with M03 APIs. |
| M04 | SaaS UX Integration | Antigravity | `COMPLETE` | Real browser session auth, /me context, accessible farms, organization/farm/user/role/audit settings integration, and permission gating. |
| M05 | Farm Composer UX | Antigravity | `PLANNED` | Tree/list farm composer and progressive configuration UX. |
| M06 | Farm Composer + Master Data Backend | Codex | `PLANNED` | Enterprise/unit/blueprint/capability and item/UOM/partner/warehouse masters. |
| M07 | Inventory Kernel | Codex | `PLANNED` | Lot-aware ledger, positions, movements/reservations, concurrency and trace hooks. |
| M08 | Inventory UX | Antigravity | `PLANNED` | Inventory masters, lot/position and movement UI on real contracts. |
| M09 | Poultry UX Prototype | Antigravity | `PLANNED` | Placement/flock/fast-log/health/harvest typed prototype. |
| M10 | Production Kernel | Codex | `PLANNED` | ProductionCycle, blueprint snapshots, operational journal and outbox. |
| M11 | Poultry Domain Backend | Codex | `PLANNED` | Broiler lifecycle/events integrated with inventory/cost/traceability. |
| M12 | Poultry Operations UX | Antigravity | `PLANNED` | Connect poultry UX to real APIs and approved offline behavior. |
| M13 | Procurement Backend | Codex | `PLANNED` | Supplier, PR/approval, PO and receipt/QC foundations. |
| M14 | Sales + Finance Lite Backend | Codex | `PLANNED` | Order-to-cash, AP/AR/payment/posting and cycle profitability. |
| M15 | Commercial + Finance UX | Antigravity | `PLANNED` | Purchasing, sales, invoice/payment and profitability UI. |
| M16 | Poultry End-to-End Integration | Codex | `PLANNED` | Automated Buy → Stock → Consume → Produce → Sell → Collect → Profit proof. |
| M17 | Poultry End-to-End UX | Antigravity | `PLANNED` | Browser/device journey validation and UX defect pass. |
| M18 | Analytics + Rules + Alerts Backend | Codex | `PLANNED` | Semantic metrics, projections, rules, alerts, tasks and notifications. |
| M19 | Dashboards + Exception UX | Antigravity | `PLANNED` | Authoritative role dashboards, exceptions and approvals. |
| M20 | Hermes + MCP Infrastructure | Codex | `PLANNED` | AI gateway, Hermes, FarmOS-owned tool gateway, read tools and audit/evals. |
| M21 | AI Assistant UX | Antigravity | `PLANNED` | Real assistant, evidence and morning briefing UX. |
| M22 | HITL Agent Actions | Codex | `PLANNED` | Risk policy, draft tools, approval and resumable execution. |
| M23 | Agentic Approval UX | Antigravity | `PLANNED` | Proposal/modify/approve/reject and pending approval UX. |
| M24 | Production Hardening | Codex | `PLANNED` | Security, correctness, recovery, observability and release gates. |
| M25 | Release Candidate UX Audit | Antigravity | `PLANNED` | Full persona/responsive/accessibility/error-state release audit. |

## Post-MVP expansion

After the poultry MVP is proven, repeat the backend → UX → integration discipline for livestock, fisheries, crops, processing/mixed-farm chains, IoT/edge, advanced analytics/ML and enterprise capabilities. Create exact later milestones only when MVP release state is known.
