# ADR-0005 — Shared Item and UOM Model

## Status
Accepted — 2026-09-22.

## Context
Inputs/outputs move through procurement, inventory, production, sales and finance and cannot use vertical-specific masters or unitless quantities.

## Decision
Catalog owns one Item/Category/UOM/conversion/Partner model. Item policy declares stock, lot/serial, expiry and trace behavior plus base/purchase/sale UOM. Quantities are decimal value + compatible UOM; conversions are controlled/effective-dated and preserve source/canonical values where reproducibility matters.

## Alternatives considered
- Per-vertical item masters: rejected due to duplicate stock/commercial truth.
- Free-text units or full EAV: rejected as ambiguous and weakly constrained.

## Consequences
Cross-domain interoperability and deterministic calculations; catalog governance and conversion precision/rounding tests become mandatory.
