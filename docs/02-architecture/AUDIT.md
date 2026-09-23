# Audit Architecture

> **Status: Authoritative (M02).** Retention periods are **Deferred** to policy/legal decisions.

Material application actions append an `AuditRecord` in the same transaction where feasible. It records tenant, record UUIDv7, occurred/recorded time, actor type/ID, impersonator/service identity, session/device/client, action, target type/ID, organization/farm scope, reason, safe prior/new state or immutable references/diff, approval reference, source/channel, correlation/causation, IP/user-agent where appropriate, AI/tool/model involvement, and outcome.

Finance, stock, approvals, health/compliance, master data, authorization changes, support access, exports, and AI tools receive enhanced audit. Secrets, credentials and unnecessary sensitive payloads are redacted.

Audit tables are append-only and inaccessible for UPDATE/DELETE to the runtime role; separate schema/role, restricted read permissions, backups and integrity hashes/chaining make tampering evident relative to ordinary business data. Corrections append records. Outbox publication and external archival may later add stronger immutability. Audit is evidence, not a replay mechanism or substitute for ledgers.
