# Identity and Authorization

> **Status: Authoritative (M02).** Identity vendor selection is **Deferred**.

## Model

- `User`: human login identity; credentials are externalized or securely hashed, never stored in domain records.
- `TenantMembership`: user-to-tenant status and lifecycle.
- `Role` and `Permission`: tenant-configurable role assignments over stable permission codes.
- `UserRole`: assignment with organization/farm/business-unit/unit scope and effective dates.
- `FarmAssignment`: operational resource scope/relationship, not a substitute for permission.
- `Session`: revocable authenticated session/device metadata and security timestamps.
- `ServiceAccount/ApiClient`: non-human principal with narrow scopes, rotated credentials, owner, expiry and allowlisted grant types.

## Evaluation

Authorization is deny-by-default RBAC plus contextual ABAC. A policy permits only when subject is active, tenant matches, entitlement/capability is enabled, permission exists, resource is in the assignment scope, lifecycle allows the action, and configured threshold/segregation rules pass. Representative codes include `poultry.flock.read`, `poultry.mortality.record`, `inventory.stock.adjust`, `procurement.po.approve`, `finance.payment.approve`, `analytics.company.read`, and `farm.settings.manage`.

Policies live in backend application/domain services; endpoint and UI checks are conveniences. Every ID loaded for a command is tenant filtered before policy evaluation. Authorization failures do not reveal cross-tenant existence.

## Authentication/session direction

NestJS authentication guards/adapters support cookie-based web sessions and standards-based OIDC/OAuth2. M03 may start with secure first-party email/password if required while preserving MFA and enterprise-SSO readiness. Cookies use Secure, HttpOnly, SameSite policy and CSRF protection; bearer tokens have narrow audience, issuer, expiry, rotation/revocation strategy. Sensitive actions may require recent authentication/MFA when implemented. Framework request objects are adapted into an immutable application principal/tenant context rather than passed into domain code.

## Approval separation

Approval is not a role name. Workflow evaluates the configured approver policy, threshold, resource scope, and segregation-of-duties rules at decision time. The initiating identity, approver identity, delegated authority, and policy version are captured.
