# FarmOS Information Architecture

> **Status:** M00 product/UX direction for the SaaS/poultry MVP. Exact routes/components are M01 implementation details.

## 1. Top-Level Navigation

The blueprint recommends a task-oriented shell rather than exposing every backend module:

```text
Home
Today
Farms
Production
Stock
Purchasing
Sales
Money
People
Assets
Analytics
AI Assistant
Settings
```

Capability and permission checks determine what each user sees. Future vertical-specific pages appear only when enabled.

## 2. Farm Context

Within a farm, the information architecture can expose:

```text
Farm Overview
Production
Facilities
Tasks
Health
Inventory
Purchasing
Sales
Finance
Maintenance
Alerts
Analytics
Documents
```

The exact subset displayed depends on tenant entitlements, farm capabilities, and user permissions.

## 3. Role-Adaptive Home Experience

- **Worker:** Today, assigned tasks, scan/open context, rapid recording, relevant alerts, sync state when offline support exists.
- **Farm Manager:** exceptions, active production, staff/tasks, input availability, purchases, harvest readiness, approvals, budget variance.
- **Owner/Executive:** multi-farm performance, profitability, cash/liabilities, production/harvest forecast, approvals, inventory exposure, AI briefing.
- **Storekeeper:** receiving, lots/expiry, holds, issues/transfers, stock counts.
- **Procurement/Finance/Sales/Vet/Technician:** capability-specific workflows without unrelated navigation noise.

## 4. Low-Input Context Inheritance

If a worker opens/scans a production unit, FarmOS should already know or resolve the farm, production unit, active cycle, time, worker identity, and allowed actions. Known values should not reappear as unnecessary dropdowns.

Example mortality capture may require only the material unknowns (such as quantity, optional/supported cause/evidence), while the backend validates live count, status, tenant/farm scope, timestamps, and permissions.

## 5. Farm Composer UX Rule

For the MVP, Farm Composer must work in **tree/list mode**. A visual layout/map is explicitly a later enhancement in the blueprint. Conversational setup may prepare a draft but cannot activate production records without review/confirmation.
