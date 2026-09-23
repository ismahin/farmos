# Idempotency Architecture

> **Status: Authoritative (M02).** Exact expiry periods are configuration determined by business replay/offline windows and legal requirements.

Material command clients send `Idempotency-Key`; offline clients should use their stable UUIDv7 command ID. Scope is `(tenant, authenticated principal/client, operation, key)` unless a source system has a narrower registered namespace. The server canonicalizes business input (excluding volatile transport metadata), hashes it, and stores status, fingerprint, resource/result reference, safe response snapshot, timestamps and correlation.

Inside the same database transaction, the server claims the unique key, performs the command, and commits business state, ledger/audit/outbox and completed result. Concurrent duplicate claims serialize. Same key+fingerprint returns the original status/result without repeating consequences; same key+different fingerprint returns `IDEMPOTENCY_KEY_REUSED` (409). Failed pre-transaction validation may be repeated; an unknown/in-progress outcome returns a retryable defined state and is reconciled, never blindly re-executed.

Natural uniqueness (`source_system,source_command_id`, source document numbers) supplements but does not replace idempotency. Consumers keep an inbox/processed-message key `(consumer,event_id)` in the same transaction as their side effect. Expiration cannot occur while an offline retry, external redelivery, financial/stock replay or audit obligation remains plausible; policies are documented per command class.
