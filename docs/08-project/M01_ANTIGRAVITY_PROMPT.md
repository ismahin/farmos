# Copy/Paste Prompt for Antigravity — M01

Use the following prompt after opening the FarmOS repository in Antigravity:

```text
You are the active implementation owner for FarmOS Milestone M01 only.

First read, in order:
1. AGENTS.md
2. docs/08-project/CURRENT_STATE.md
3. docs/08-project/MILESTONES.md
4. docs/08-project/handoffs/M00.md
5. docs/08-project/M01_EXECUTION_BRIEF.md
6. docs/01-product/MVP_SCOPE.md
7. docs/05-ui/INFORMATION_ARCHITECTURE.md
8. docs/05-ui/USER_FLOWS.md
9. docs/05-ui/SCREEN_REGISTRY.md

Use docs/00-master/FarmOS_Master_Blueprint.md when product intent is unclear.

Implement ONLY M01 — Frontend Foundation / UX Prototype.

Key rules:
- frontend only
- Next.js + TypeScript
- use typed mock data/context because backend does not exist yet
- no production database/migrations
- no backend APIs/services
- no real auth/security implementation beyond frontend mock/scaffold behavior
- no authoritative ERP calculations in frontend
- no Hermes/MCP execution
- Farm Composer is tree/list first; do not require a visual drag/drop canvas
- build responsive, accessible, low-input interaction patterns
- verify representative flows in the browser at mobile/tablet/desktop widths

Required outcomes:
- reusable frontend structure and UI primitives/design tokens
- responsive global app shell and navigation
- representative mock screens for Home, Today, Farms, Production, Stock, Purchasing, Sales, Money, Analytics, AI Assistant
- onboarding prototype:
  Signup → Organization → Farm → Poultry/Broiler → Houses → Warehouse → Farm dashboard
- representative Farm Composer and poultry interaction patterns

At completion:
- run applicable checks
- update CURRENT_STATE.md
- update MILESTONES.md
- update BACKLOG.md / KNOWN_ISSUES.md as needed
- update UI docs if implementation changed the proposed IA/flows
- create docs/08-project/handoffs/M01.md using the handoff template
- mark M01 COMPLETE and M02 as next
- provide a concise completion report
- STOP; do not begin M02
```
