import { ApiProblemError } from "./errors";
import type { ProblemDetails } from "./types";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  idempotencyKey?: string;
  ifMatch?: string;
  sessionTransport?: "cookie";
}

export interface ApiResponse<T> {
  data: T;
  etag?: string;
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function generateIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `key-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    body,
    headers: customHeaders = {},
    idempotencyKey,
    ifMatch,
    sessionTransport,
    ...fetchOptions
  } = options;

  const url = endpoint.startsWith("http://") || endpoint.startsWith("https://")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers = new Headers(customHeaders);

  if (body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (idempotencyKey) {
    headers.set("Idempotency-Key", idempotencyKey);
  }

  if (ifMatch) {
    headers.set("If-Match", ifMatch.startsWith('"') ? ifMatch : `"${ifMatch}"`);
  }

  if (sessionTransport === "cookie") {
    headers.set("X-Session-Transport", "cookie");
  }

  const response = await fetch(url, {
    ...fetchOptions,
    credentials: "include",
    headers,
    body: body !== undefined ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
  });

  const etag = response.headers.get("ETag") ?? undefined;

  if (!response.ok) {
    let problem: ProblemDetails;
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("json") || contentType.includes("problem+json")) {
      try {
        const json = await response.json();
        problem = {
          type: json.type,
          title: json.title || response.statusText,
          status: json.status || response.status,
          code: json.code || (response.status === 401 ? "AUTHENTICATION_REQUIRED" : "ERROR"),
          message: json.message || response.statusText,
          correlationId: json.correlationId,
          fieldErrors: json.fieldErrors,
          details: json.details,
        };
      } catch {
        problem = {
          title: response.statusText,
          status: response.status,
          code: response.status === 401 ? "AUTHENTICATION_REQUIRED" : "ERROR",
          message: `Request failed with status ${response.status}`,
        };
      }
    } else {
      const text = await response.text().catch(() => "");
      problem = {
        title: response.statusText,
        status: response.status,
        code: response.status === 401 ? "AUTHENTICATION_REQUIRED" : "ERROR",
        message: text || `Request failed with status ${response.status}`,
      };
    }

    throw new ApiProblemError(problem);
  }

  if (response.status === 204) {
    return { data: undefined as unknown as T, etag };
  }

  const data = (await response.json()) as T;
  return { data, etag };
}

