# Poultry Domain

> **Status: Authoritative (M02) for broiler MVP.** Layer depth is **Deferred**.

`Flock` is the poultry projection/aggregate associated one-to-one with a broiler `ProductionCycle`; Production owns common lifecycle/blueprint/cost identity while Poultry owns bird semantics. Placement identifies source lot/supplier, hatch/arrival, received/rejected/placed count, initial weight and strain. DailyRecord groups reporting context but never replaces immutable events.

Owned facts: Placement, Mortality, Cull, FeedConsumption link, WaterConsumption, WeightSample, HealthRecord, Vaccination, and Harvest. Inventory owns feed/medicine/output stock; Production owns common consumption/output events; Poultry orchestrates domain meaning through their contracts.

## Invariants

- Placement is positive, source/reference valid, happens once, and activates only an eligible cycle/unit.
- Mortality/cull count is a positive integer and cannot exceed server-calculated live birds at commit.
- Operational events require Active/Harvesting state as defined; recorded occurrence cannot precede placement without an explicit correction workflow.
- Weight samples have positive sample count/weights and valid mass UOM; derived averages/FCR/livability use centrally versioned deterministic formulas.
- Feed/medicine/vaccine commands require compatible item policy/UOM and successful Inventory consequence when stocked.
- Vaccination retains product/lot, dose/UOM, administrator, occurred time and health provenance; withdrawal/policy controls are configurable.
- Partial harvest reduces live availability exactly once; total mortality+cull+transfer-out+harvest never exceeds placed+transfer-in after corrections.
- Closed flocks accept only explicit correction/reopen workflows with permission/audit. Harvest output cannot exceed biologically/transactionally permitted quantity.

Commands emit poultry facts and corresponding common events: PlaceFlock, RecordMortality, RecordCull, RecordFeed, RecordWater, RecordWeightSample, RecordHealth, AdministerVaccination, RecordHarvest. Queries return authoritative base facts plus named/versioned KPI projections; frontend formulas are illustrative only.
