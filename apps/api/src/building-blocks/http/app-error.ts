export type ErrorCode =
  | "VALIDATION_FAILED" | "AUTHENTICATION_REQUIRED" | "ACTION_FORBIDDEN"
  | "RESOURCE_NOT_FOUND" | "RESOURCE_CONFLICT" | "BUSINESS_RULE_VIOLATION"
  | "CONCURRENCY_CONFLICT" | "IDEMPOTENCY_KEY_REUSED" | "COMMAND_IN_PROGRESS"
  | "FEATURE_NOT_ENTITLED" | "RATE_LIMITED" | "INTERNAL_FAILURE";

export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly code: ErrorCode,
    message: string,
    readonly details?: Record<string, unknown>,
  ) { super(message); }
}
