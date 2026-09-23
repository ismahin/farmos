import type { ProblemDetails } from "./types";

export class ApiProblemError extends Error {
  readonly status: number;
  readonly code: string;
  readonly title: string;
  readonly correlationId?: string;
  readonly fieldErrors?: Array<{ field: string; code: string; message: string }>;
  readonly details?: Record<string, unknown>;

  constructor(problem: ProblemDetails) {
    super(problem.message || problem.title || "An API error occurred");
    this.name = "ApiProblemError";
    this.status = problem.status;
    this.code = problem.code;
    this.title = problem.title;
    this.correlationId = problem.correlationId;
    this.fieldErrors = problem.fieldErrors;
    this.details = problem.details;
  }
}

export function isApiProblemError(error: unknown): error is ApiProblemError {
  return error instanceof ApiProblemError;
}

export function formatApiErrorMessage(error: unknown, defaultMessage = "An unexpected error occurred"): string {
  if (isApiProblemError(error)) {
    if (error.fieldErrors && error.fieldErrors.length > 0) {
      const fieldList = error.fieldErrors.map((f) => `${f.field}: ${f.message}`).join(", ");
      return `${error.message} (${fieldList})`;
    }
    return error.message || error.title || defaultMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
}

export function getFieldError(error: unknown, fieldName: string): string | undefined {
  if (isApiProblemError(error) && error.fieldErrors) {
    const matched = error.fieldErrors.find((fe) => fe.field === fieldName);
    return matched?.message;
  }
  return undefined;
}

