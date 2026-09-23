# Security Architecture

> **Status: Authoritative (M02).** Exact vendors, key rotation periods, and rate limits remain configuration/operations decisions.

FarmOS uses defense in depth and least privilege. Threat priorities are tenant crossover, broken object authorization, ledger manipulation, credential/session theft, unsafe uploads/integrations, privileged misuse, and AI tool/prompt abuse.

## Controls

- **Authentication:** NestJS guards over standards-based session/OIDC/OAuth2 adapters; modern password hashing if local credentials exist; verified recovery; revocable sessions; MFA-ready challenge model; separate service/device identities.
- **Authorization:** deny-by-default RBAC + contextual ABAC in application services; resource IDs always tenant filtered; entitlements server enforced; high-risk workflow/HITL and segregation of duties.
- **Tenant isolation:** application predicates plus composite constraints and forced PostgreSQL RLS as documented in `MULTITENANCY.md`; no client/model authoritative tenant input.
- **Transport/storage:** TLS, encrypted managed volumes/backups/object storage, secrets manager/environment injection, no secrets in source/logs, least-privilege DB/IAM roles.
- **Sessions/tokens:** Secure/HttpOnly cookies, CSRF defense, audience/issuer/expiry validation, rotation/revocation, device/session audit, no tokens in URLs.
- **Uploads:** allowlisted type/size, magic-byte verification, malware scanning/quarantine, content hash, randomized object keys, signed access, no active content execution.
- **Abuse:** rate and concurrency limits by tenant/subject/client/action; stricter auth/tool/upload limits; safe retry semantics.
- **Operations:** separated environments/credentials, audited just-in-time production access, synthetic data outside production, dependency/SAST/container/secret scans, encrypted tested backups, incident evidence.
- **Observability/privacy:** structured security events and correlations without credentials, raw tokens, or unnecessary payload/PII.

## AI trust boundary

AI input and retrieved documents are untrusted data, never policy. Hermes receives only scoped tools; the gateway authenticates outside tool arguments, allowlists schemas, reauthorizes every call, classifies risk, requires approval where configured, and calls normal application services. There is no arbitrary SQL, filesystem, unrestricted internal HTTP, tenant switching, raw credential, unrestricted posting, or privilege-management tool. Tool request/result, model/tool version, evidence and approval are audited.

## Verification gates

M03 must prove tenant negative cases and authorization policies. Later gates add upload malware handling, service-account rotation, rate limiting, dependency/static/dynamic scanning, prompt-injection/tool tests, backup/restore, and production access review before release.
