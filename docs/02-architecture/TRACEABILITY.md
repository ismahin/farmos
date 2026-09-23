# Traceability Architecture

> **Status: Authoritative (M02).** Full GS1/EPCIS conformance is **Deferred**.

Traceability owns `TraceableObject` (lot, cycle, batch, shipment or individually tracked subject), immutable `TraceEvent`, `GenealogyLink`, and `ShipmentTrace`. It preserves who, what, where, when, and why with business step/disposition, quantities/UOM, source document, actor and correlation.

Genealogy links are typed (`CONSUMED_IN`, `PRODUCED_FROM`, `TRANSFORMED_TO`, `AGGREGATED_IN`, `SPLIT_FROM`, `SHIPPED_AS`) and directionally queryable. Each link carries tenant, source/target identity, effective event, quantity if divisible, and provenance. Input/output conservation rules belong to the source transformation/production module; Traceability rejects cross-tenant or impossible object types.

```text
Feed Lot -> Broiler ProductionCycle -> Harvest Lot -> Processing Batch -> Shipment -> Customer
```

Inventory receipt creates/recognizes lot objects; issue links lot to cycle; harvest links cycle to output lot; processing links inputs/outputs; shipment links allocated lots to destination/customer. Corrections append superseding/reversal evidence. Recall queries traverse upstream/downstream, locate remaining stock/shipments/customers, and support hold/worklist commands through owning modules.

Identifiers, event time, location, business step and disposition are modeled so a future adapter can map to GS1/EPCIS vocabulary without making EPCIS infrastructure an MVP dependency.
