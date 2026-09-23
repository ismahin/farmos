# FarmOS Core MVP User Flows

> **Status:** M00 UX flows. These describe product behavior, not final route/API contracts.

## 1. Onboarding / Farm Composer

```text
Sign up
→ create organization
→ create farm
→ choose Poultry / Broiler
→ add houses in list/tree form
→ add warehouse/storage
→ select/default blueprint
→ configure team
→ review
→ activate farm
```

Optional later assistance:

```text
Natural-language farm description
→ AI parses supported facts
→ FarmOS creates DRAFT topology
→ assumptions/missing material fields shown
→ owner confirms
→ deterministic activation workflow
```

## 2. Start Broiler Cycle

```text
Farm / Production
→ Create cycle
→ select House
→ select blueprint/version
→ enter placement/source facts
→ preview generated plan/tasks/budget hooks
→ confirm
→ cycle becomes ready/active according to domain rules
```

## 3. Daily Fast Log

```text
Today or House context
→ system resolves active flock
→ choose Mortality / Feed / Weight / Health action
→ enter only unknown values
→ confirm
→ backend validates command
→ success + updated status
```

If offline client behavior is introduced, commands are queued with idempotency and later validated by the server; stock/finance conflicts are not resolved solely on-device.

## 4. Procure to Stock

```text
Requirement / manual need
→ Purchase Requisition
→ approval according to workflow
→ Purchase Order
→ delivery
→ Goods Receipt
→ quality/lot/expiry handling as configured
→ stock becomes available/held according to status
```

## 5. Harvest to Cash

```text
Harvest
→ output/harvest lot and availability
→ Sales Order
→ allocation
→ dispatch/shipment
→ delivery confirmation where used
→ invoice
→ collection/payment
→ receivable/cash state updated
→ cycle profitability refreshed
```

## 6. AI Draft with Human Review

```text
User intent
→ Hermes chooses permitted FarmOS tool
→ FarmOS reads deterministic facts
→ draft/proposal created
→ user sees parameters/evidence/policy warnings
→ user modifies/approves/rejects
→ authorized workflow executes
→ audit + source records retained
```
