# Accounting and Production Costing Foundation

> **Status: Authoritative guardrails (M02).** Chart design, jurisdictional tax, detailed posting matrix, valuation election, close procedure and allocation formulas are **Deferred** to M14.

Finance owns `Account`, balanced `JournalEntry`/`JournalLine`, `Payable`, `Receivable`, `Payment`, `BankAccount`, `Budget`, and `CostCenter`. Each entry belongs to tenant/legal entity, accounting date/period, currency, status, source transaction type/ID, correlation and reversal reference. Lines carry account, debit/credit fixed decimals, currency/base amount, and cost dimensions.

Rules:

- Draft journals are editable under policy; posted journals/lines are immutable. Corrections use linked reversal and adjustment entries.
- Debit equals credit per currency/base-currency rules. Closed periods block unauthorized backdating/reopening.
- Every generated journal references its originating business transaction; unique source/type prevents duplicate posting.
- AI may explain or prepare a draft but never calculates/owns balances or bypasses posting/approval.
- Inventory valuation (weighted average initially supported; FIFO where configured) is accounting policy distinct from FEFO/FIFO picking.

Production cost attribution accepts source transactions for biological starting stock, feed/seed/fertilizer, medicine/chemicals, direct/indirect labor, utilities/fuel, equipment/depreciation/maintenance, transport, consumables/packaging and overhead. Dimensions are organization, farm, enterprise, production unit, production cycle, product and cost center. Production links causal facts; Finance owns monetary valuation, allocation and authoritative cycle P&L. Revenue is recognized from commercial/finance transactions, not UI estimates.
