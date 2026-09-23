import {
  apiFetch,
  generateIdempotencyKey,
  ApiProblemError,
  formatApiErrorMessage,
  isApiProblemError,
  getFieldError,
} from "@/lib/api";

describe("API Client & Error Handling", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  test("generates unique idempotency keys", () => {
    const key1 = generateIdempotencyKey();
    const key2 = generateIdempotencyKey();
    expect(key1).toBeTruthy();
    expect(key2).toBeTruthy();
    expect(key1).not.toBe(key2);
  });

  test("sends requests with credentials: include, custom headers, and parses json", async () => {
    const mockJson = { user: { id: "u-1", displayName: "Tester" } };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({
        "content-type": "application/json",
        etag: '"v1"',
      }),
      json: async () => mockJson,
    });

    const response = await apiFetch<typeof mockJson>("/api/v1/test", {
      method: "POST",
      body: { action: "ping" },
      idempotencyKey: "idem-123",
      ifMatch: "v1",
      sessionTransport: "cookie",
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toContain("/api/v1/test");
    expect(init.credentials).toBe("include");
    expect(init.method).toBe("POST");

    const headers = init.headers as Headers;
    expect(headers.get("Content-Type")).toBe("application/json");
    expect(headers.get("Idempotency-Key")).toBe("idem-123");
    expect(headers.get("If-Match")).toBe('"v1"');
    expect(headers.get("X-Session-Transport")).toBe("cookie");

    expect(response.data).toEqual(mockJson);
    expect(response.etag).toBe('"v1"');
  });

  test("handles 204 No Content without attempting json parse", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 204,
      headers: new Headers(),
    });

    const response = await apiFetch<void>("/api/v1/resource", {
      method: "DELETE",
    });

    expect(response.data).toBeUndefined();
  });

  test("parses RFC 9457 Problem Details into ApiProblemError on failure", async () => {
    const problemPayload = {
      type: "https://api.farmos.example/problems/validation",
      title: "Validation Failed",
      status: 400,
      code: "VALIDATION_FAILED",
      message: "The submitted farm code is invalid.",
      correlationId: "corr-xyz-789",
      fieldErrors: [
        { field: "code", code: "INVALID_FORMAT", message: "Must be uppercase alphanumeric" },
      ],
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      headers: new Headers({ "content-type": "application/problem+json" }),
      json: async () => problemPayload,
    });

    try {
      await apiFetch("/api/v1/farms", { method: "POST", body: {} });
      fail("Expected apiFetch to throw ApiProblemError");
    } catch (err) {
      expect(isApiProblemError(err)).toBe(true);
      const apiErr = err as ApiProblemError;
      expect(apiErr.status).toBe(400);
      expect(apiErr.code).toBe("VALIDATION_FAILED");
      expect(apiErr.correlationId).toBe("corr-xyz-789");
      expect(apiErr.fieldErrors).toHaveLength(1);
      expect(apiErr.fieldErrors?.[0].field).toBe("code");
      expect(getFieldError(apiErr, "code")).toBe("Must be uppercase alphanumeric");
      expect(formatApiErrorMessage(apiErr)).toContain("code: Must be uppercase alphanumeric");
    }
  });

  test("constructs fallback ApiProblemError for non-JSON or raw text errors", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      headers: new Headers({ "content-type": "text/plain" }),
      text: async () => "Authentication required",
    });

    try {
      await apiFetch("/api/v1/me");
      fail("Expected apiFetch to throw");
    } catch (err) {
      expect(isApiProblemError(err)).toBe(true);
      const apiErr = err as ApiProblemError;
      expect(apiErr.status).toBe(401);
      expect(apiErr.code).toBe("AUTHENTICATION_REQUIRED");
      expect(apiErr.message).toBe("Authentication required");
    }
  });
});

