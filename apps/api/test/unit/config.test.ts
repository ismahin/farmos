import { describe, expect, it } from "vitest";
import { loadConfig } from "../../src/config.js";
import { sessionCookieOptions } from "../../src/building-blocks/http/browser-session.js";

describe("configuration", () => {
  it("rejects a missing database URL", () => { expect(() => loadConfig({})).toThrow("DATABASE_URL is required"); });
  it("parses validated values", () => { expect(loadConfig({ DATABASE_URL: "postgres://localhost/farmos", PORT: "3001", SESSION_TTL_HOURS: "8" })).toMatchObject({ port: 3001, sessionTtlHours: 8 }); });
  it("requires HTTPS origins and Secure cookies in production", () => {
    const config = loadConfig({ DATABASE_URL: "postgres://localhost/farmos", NODE_ENV: "production", WEB_ORIGINS: "https://app.farmos.example" });
    expect(config.browserOrigins).toEqual(["https://app.farmos.example"]);
    expect(sessionCookieOptions(config)).toMatchObject({ httpOnly: true, secure: true, sameSite: "lax", path: "/api", maxAge: 43_200_000 });
    expect(() => loadConfig({ DATABASE_URL: "postgres://localhost/farmos", NODE_ENV: "production" })).toThrow("WEB_ORIGINS is required in production");
    expect(() => loadConfig({ DATABASE_URL: "postgres://localhost/farmos", NODE_ENV: "production", WEB_ORIGINS: "http://app.farmos.example" })).toThrow("use HTTPS in production");
  });
});
