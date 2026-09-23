# FarmOS — Multi-Tenant Agriculture ERP SaaS

FarmOS is a configurable Agriculture Operating System connecting farm setup, production, inventory, procurement, sales, finance, traceability, analytics and human-supervised AI. The first commercial proof is poultry: **Buy → Stock → Consume → Produce → Harvest → Sell → Collect → Profit**.

## Project operating model

Repository state—not chat history—is project memory. Begin with `AGENTS.md`, `docs/08-project/CURRENT_STATE.md`, `docs/08-project/MILESTONES.md`, and the latest handoff.

## Current state

- **Completed:** M02A — Backend Technology Amendment
- **Completed:** M03B — Browser Authentication Bridge (Codex)
- **Next:** M04 — SaaS UX Integration (Antigravity)
- **Frontend:** M01 Next.js/TypeScript responsive prototype using typed mocks
- **Backend:** not implemented; M02A freezes Node.js 24 LTS + strict TypeScript + NestJS + Drizzle/`pg` + PostgreSQL
- **First production vertical:** poultry/broiler

See `docs/08-project/CURRENT_STATE.md` and `docs/08-project/handoffs/M02.md`.

## Documentation map

```text
docs/
├── 00-master/       authoritative product/technical blueprint
├── 01-product/      scope, glossary, journeys and formal SRS
├── 02-architecture/ frozen M02 architecture and accepted ADRs
├── 03-database/     PostgreSQL ERD and schema/migration rules
├── 04-contracts/    REST/error/frontend/event/MCP contracts
├── 05-ui/           information architecture, flows and screens
├── 06-testing/      authoritative strategy and golden E2E
├── 07-ai/           Hermes/FarmOS trust guardrails
├── 08-project/      milestones, state, backlog, issues and handoffs
└── 09-operations/   operations/SRE guardrails
```

The architecture is a modular monolith with PostgreSQL truth, trusted tenant context plus RLS defense in depth, common ProductionCycle/Item/UOM, append-only inventory and financial histories, REST/OpenAPI, transactional outbox, and controlled FarmOS-owned AI tools. Vendors and phase-specific operational targets remain deferred where documented.
