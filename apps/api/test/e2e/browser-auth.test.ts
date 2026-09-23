import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Pool } from "pg";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { configureHttp } from "../../src/building-blocks/http/configure-http.js";
import { loadConfig } from "../../src/config.js";
import { startTestDatabase, type TestDatabase } from "../support/postgres.js";

function sessionCookie(response: request.Response): string {
  const values = response.headers["set-cookie"] as unknown;
  const first = Array.isArray(values) ? values[0] : values;
  if (typeof first !== "string") throw new Error("Session cookie was not issued");
  return first.split(";", 1)[0] ?? "";
}

describe("M03B browser authentication bridge", () => {
  let database: TestDatabase;
  let app: INestApplication;
  const origin = "http://localhost:3000";
  const browserHeaders = { Origin: origin, "X-Session-Transport": "cookie" };
  const bootstrapToken = "browser-bootstrap-token-that-is-long";

  beforeAll(async () => {
    database = await startTestDatabase();
    process.env.DATABASE_URL = database.runtimeUrl;
    process.env.BOOTSTRAP_TOKEN = bootstrapToken;
    process.env.NODE_ENV = "test";
    process.env.WEB_ORIGINS = origin;
    const { AppModule } = await import("../../src/app.module.js");
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    configureHttp(app, loadConfig());
    await app.init();
  });

  afterAll(async () => { await app.close(); await database.container.stop(); });

  it("issues an HttpOnly cookie, protects mutations, resolves /me, and preserves tenant and farm authority", async () => {
    const ownerA = await request(app.getHttpServer()).post("/api/v1/auth/register").set(browserHeaders).set("X-Bootstrap-Token", bootstrapToken).send({ displayName: "Browser Tenant A", email: "browser-owner-a@example.com", password: "correct horse battery staple" }).expect(201);
    expect(ownerA.body).not.toHaveProperty("accessToken");
    const ownerACookie = sessionCookie(ownerA);
    const setCookie = (ownerA.headers["set-cookie"] as unknown as string[])[0] ?? "";
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Lax");
    expect(setCookie).toContain("Path=/api");
    expect(setCookie).toContain("Max-Age=");
    expect(setCookie).not.toContain("Secure");

    const meA = await request(app.getHttpServer()).get("/api/v1/me").set("Cookie", ownerACookie).set("X-Tenant-Id", "00000000-0000-0000-0000-000000000000").expect(200);
    expect(meA.body.user.email).toBe("browser-owner-a@example.com");
    expect(meA.body.tenant.displayName).toBe("Browser Tenant A");
    expect(meA.body.permissions).toContain("farm.create");
    expect(meA.body.farmScope.allFarms).toBe(true);
    await request(app.getHttpServer()).get("/api/v1/me").expect(401);

    const organizationPayload = { code: "BROWSE", displayName: "Browser Organization", legalName: "Browser Organization Ltd", baseCurrency: "USD" };
    await request(app.getHttpServer()).post("/api/v1/organizations").set("Cookie", ownerACookie).set("Idempotency-Key", "browser-org-missing-origin").send(organizationPayload).expect(403);
    await request(app.getHttpServer()).post("/api/v1/organizations").set("Cookie", ownerACookie).set("Origin", "https://evil.example").set("Idempotency-Key", "browser-org-evil-origin").send(organizationPayload).expect(403);
    const organization = await request(app.getHttpServer()).post("/api/v1/organizations").set("Cookie", ownerACookie).set("Origin", origin).set("Idempotency-Key", "browser-org-allowed-001").send(organizationPayload).expect(201);
    const farmOne = await request(app.getHttpServer()).post("/api/v1/farms").set("Cookie", ownerACookie).set("Origin", origin).set("Idempotency-Key", "browser-farm-one-001").send({ organizationId: organization.body.id, code: "WEB1", displayName: "Browser Farm One", timezone: "UTC" }).expect(201);
    const farmTwo = await request(app.getHttpServer()).post("/api/v1/farms").set("Cookie", ownerACookie).set("Origin", origin).set("Idempotency-Key", "browser-farm-two-001").send({ organizationId: organization.body.id, code: "WEB2", displayName: "Browser Farm Two", timezone: "UTC" }).expect(201);

    const worker = await request(app.getHttpServer()).post("/api/v1/users").set("Cookie", ownerACookie).set("Origin", origin).send({ email: "browser-worker@example.com", displayName: "Browser Worker", temporaryPassword: "worker password 12345" }).expect(201);
    const roles = await request(app.getHttpServer()).get("/api/v1/roles").set("Cookie", ownerACookie).expect(200);
    const workerRole = (roles.body as Array<{ id: string; code: string }>).find((role) => role.code === "WORKER");
    await request(app.getHttpServer()).post(`/api/v1/users/${worker.body.id}/role-assignments`).set("Cookie", ownerACookie).set("Origin", origin).send({ roleId: workerRole?.id }).expect(204);
    await request(app.getHttpServer()).post(`/api/v1/users/${worker.body.id}/farm-assignments`).set("Cookie", ownerACookie).set("Origin", origin).send({ farmId: farmOne.body.id }).expect(204);

    const workerLogin = await request(app.getHttpServer()).post("/api/v1/auth/login").set(browserHeaders).send({ email: "browser-worker@example.com", password: "worker password 12345" }).expect(200);
    expect(workerLogin.body).not.toHaveProperty("accessToken");
    const workerCookie = sessionCookie(workerLogin);
    await request(app.getHttpServer()).get(`/api/v1/farms/${farmOne.body.id}`).set("Cookie", workerCookie).expect(200);
    await request(app.getHttpServer()).get(`/api/v1/farms/${farmTwo.body.id}`).set("Cookie", workerCookie).expect(403);

    const ownerB = await request(app.getHttpServer()).post("/api/v1/auth/register").set(browserHeaders).set("X-Bootstrap-Token", bootstrapToken).send({ displayName: "Browser Tenant B", email: "browser-owner-b@example.com", password: "another strong password 123" }).expect(201);
    const meB = await request(app.getHttpServer()).get("/api/v1/me").set("Cookie", sessionCookie(ownerB)).set("X-Tenant-Id", meA.body.tenant.id as string).expect(200);
    expect(meB.body.tenant.id).toBe(ownerB.body.tenantId);

    await request(app.getHttpServer()).post("/api/v1/auth/logout").set("Cookie", workerCookie).set("Origin", origin).expect(204).expect("set-cookie", /Expires=Thu, 01 Jan 1970/);
    await request(app.getHttpServer()).get("/api/v1/me").set("Cookie", workerCookie).expect(401);
    const relogin = await request(app.getHttpServer()).post("/api/v1/auth/login").set(browserHeaders).send({ email: "browser-worker@example.com", password: "worker password 12345" }).expect(200);
    expect(sessionCookie(relogin)).not.toBe(workerCookie);
    const admin = new Pool({ connectionString: database.adminUrl });
    await admin.query("update identity.sessions set expires_at=now()-interval '1 minute' where user_id=(select id from identity.users where email='browser-worker@example.com') and revoked_at is null");
    await request(app.getHttpServer()).get("/api/v1/me").set("Cookie", sessionCookie(relogin)).expect(401);
    const activeAgain = await request(app.getHttpServer()).post("/api/v1/auth/login").set(browserHeaders).send({ email: "browser-worker@example.com", password: "worker password 12345" }).expect(200);
    await admin.query("update identity.users set status='DISABLED' where email='browser-worker@example.com'");
    await admin.end();
    await request(app.getHttpServer()).get("/api/v1/me").set("Cookie", sessionCookie(activeAgain)).expect(401);
  });

  it("allows credentialed CORS only for configured origins", async () => {
    const allowed = await request(app.getHttpServer()).options("/api/v1/me").set("Origin", origin).set("Access-Control-Request-Method", "GET").expect(204);
    expect(allowed.headers["access-control-allow-origin"]).toBe(origin);
    expect(allowed.headers["access-control-allow-credentials"]).toBe("true");
    const denied = await request(app.getHttpServer()).options("/api/v1/me").set("Origin", "https://evil.example").set("Access-Control-Request-Method", "GET").expect(204);
    expect(denied.headers).not.toHaveProperty("access-control-allow-origin");
  });
});
