# Workflow and Approval Architecture

> **Status: Authoritative (M02).** Implement only capabilities required by later milestones.

The generic model comprises versioned `WorkflowDefinition` (trigger, conditions, steps, approver selectors, actions, escalation/completion rules), `WorkflowInstance`, `ApprovalRequest`, and immutable `ApprovalDecision`. An instance freezes its definition version and relevant policy/input snapshot.

The caller starts a workflow with a typed resource reference and proposed command. Workflow does not mutate the owning aggregate directly: approval produces an authorization artifact; the owning application service revalidates current state, permission, idempotency, and business rules before execution. Stale proposals can expire or require reapproval.

Approver selection can use role/permission, organization/farm scope, amount/currency-normalized threshold, risk/action class, and segregation-of-duties rules. Thresholds and chains are effective-dated tenant configuration, never hard-coded amounts. Decisions record actor, authority, reason, time, policy/definition version, correlation, delegation and evidence.

Initial supported patterns are PR/PO, payment, discount, stock adjustment/disposal, quality release, and medicine approval. AI-originated proposals follow the identical workflow and are labeled/audited; AI cannot approve.
