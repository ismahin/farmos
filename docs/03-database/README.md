# FarmOS Database Architecture

> **Status: Authoritative index (M02, amended by M02A).**

- `ERD.md` freezes the PostgreSQL logical/physical v1 baseline, ownership, keys, tenant scope, constraints and index direction.
- `SCHEMA_RULES.md` freezes naming, UUIDv7, tenant composite integrity/RLS, time/money/quantity, JSONB, immutability and migration rules.

M03 creates the first Drizzle/SQL migrations for its assigned foundation only. Later modules extend their owned schemas without weakening the M02 rules. No production migrations were created in M02/M02A.
