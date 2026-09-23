import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { configureHttp } from "../../src/building-blocks/http/configure-http.js";
import { loadConfig } from "../../src/config.js";
import { startTestDatabase, type TestDatabase } from "../support/postgres.js";

describe("M03 foundation journey", () => {
  let database: TestDatabase;
  let app: INestApplication;
  const bootstrapToken = "test-bootstrap-token-that-is-long";

  beforeAll(async () => {
    database = await startTestDatabase();
    process.env.DATABASE_URL = database.runtimeUrl;
    process.env.BOOTSTRAP_TOKEN = bootstrapToken;
    process.env.SESSION_TTL_HOURS = "12";
    const { AppModule } = await import("../../src/app.module.js");
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    configureHttp(app, loadConfig());
    await app.init();
  });

  afterAll(async () => { await app.close(); await database.container.stop(); });

  it("bootstraps tenants and enforces permissions, farm scope, idempotency, concurrency, and audit", async () => {
    await request(app.getHttpServer()).get("/api/v1/farms").expect(401);
    const ownerA = await request(app.getHttpServer()).post("/api/v1/auth/register").set("X-Bootstrap-Token", bootstrapToken).send({ displayName: "Tenant A", email: "owner-a@example.com", password: "correct horse battery staple" }).expect(201);
    const ownerToken = ownerA.body.accessToken as string;
    const authA = { Authorization: `Bearer ${ownerToken}` };
    const organizationRequest = { code: "AORG", displayName: "A Organization", legalName: "A Organization Ltd", baseCurrency: "USD" };
    const organization = await request(app.getHttpServer()).post("/api/v1/organizations").set(authA).set("Idempotency-Key", "organization-a-001").send(organizationRequest).expect(201);
    const replay = await request(app.getHttpServer()).post("/api/v1/organizations").set(authA).set("Idempotency-Key", "organization-a-001").send(organizationRequest).expect(201);
    expect(replay.body.id).toBe(organization.body.id);
    await request(app.getHttpServer()).post("/api/v1/organizations").set(authA).set("Idempotency-Key", "organization-a-001").send({ ...organizationRequest, displayName: "Changed" }).expect(409);

    const farmOneRequest = { organizationId: organization.body.id, code: "FARM1", displayName: "Farm One", timezone: "Asia/Dhaka" };
    const [farmOne, concurrentReplay] = await Promise.all([
      request(app.getHttpServer()).post("/api/v1/farms").set(authA).set("Idempotency-Key", "farm-a-one-001").send(farmOneRequest).expect(201),
      request(app.getHttpServer()).post("/api/v1/farms").set(authA).set("Idempotency-Key", "farm-a-one-001").send(farmOneRequest).expect(201),
    ]);
    expect(concurrentReplay.body.id).toBe(farmOne.body.id);
    const farmTwo = await request(app.getHttpServer()).post("/api/v1/farms").set(authA).set("Idempotency-Key", "farm-a-two-001").send({ organizationId: organization.body.id, code: "FARM2", displayName: "Farm Two", timezone: "UTC" }).expect(201);
    expect((await request(app.getHttpServer()).get("/api/v1/farms?pageSize=1").set(authA).expect(200)).body.page.hasMore).toBe(true);

    const user = await request(app.getHttpServer()).post("/api/v1/users").set(authA).send({ email: "worker-a@example.com", displayName: "Worker A", temporaryPassword: "worker password 12345" }).expect(201);
    const roles = await request(app.getHttpServer()).get("/api/v1/roles").set(authA).expect(200);
    const workerRole = (roles.body as Array<{ id: string; code: string }>).find((role) => role.code === "WORKER");
    expect(workerRole).toBeDefined();
    await request(app.getHttpServer()).post(`/api/v1/users/${user.body.id}/role-assignments`).set(authA).send({ roleId: workerRole?.id }).expect(204);
    await request(app.getHttpServer()).post(`/api/v1/users/${user.body.id}/farm-assignments`).set(authA).send({ farmId: farmOne.body.id }).expect(204);
    const workerLogin = await request(app.getHttpServer()).post("/api/v1/auth/login").send({ email: "worker-a@example.com", password: "worker password 12345" }).expect(200);
    const authWorker = { Authorization: `Bearer ${workerLogin.body.accessToken as string}` };
    await request(app.getHttpServer()).get(`/api/v1/farms/${farmOne.body.id}`).set(authWorker).expect(200);
    await request(app.getHttpServer()).get(`/api/v1/farms/${farmTwo.body.id}`).set(authWorker).expect(403);
    await request(app.getHttpServer()).post("/api/v1/farms").set(authWorker).set("Idempotency-Key", "worker-denied-001").send({ organizationId: organization.body.id, code: "NOPE", displayName: "Nope Farm", timezone: "UTC" }).expect(403);

    const staleUpdate = { displayName: "Farm One Updated", timezone: "UTC" };
    await request(app.getHttpServer()).patch(`/api/v1/farms/${farmOne.body.id}`).set(authA).set("If-Match", '"1"').send(staleUpdate).expect(200);
    await request(app.getHttpServer()).patch(`/api/v1/farms/${farmOne.body.id}`).set(authA).set("If-Match", '"1"').send(staleUpdate).expect(412);

    const ownerB = await request(app.getHttpServer()).post("/api/v1/auth/register").set("X-Bootstrap-Token", bootstrapToken).send({ displayName: "Tenant B", email: "owner-b@example.com", password: "another strong password 123" }).expect(201);
    const authB = { Authorization: `Bearer ${ownerB.body.accessToken as string}` };
    await request(app.getHttpServer()).get(`/api/v1/farms/${farmOne.body.id}`).set(authB).expect(404);
    await request(app.getHttpServer()).get(`/api/v1/farms/${farmOne.body.id}`).set("Authorization", `Bearer ${ownerB.body.accessToken as string}`).set("X-Tenant-Id", ownerA.body.tenantId as string).expect(404);
    await request(app.getHttpServer()).post("/api/v1/farms").set(authA).set("Idempotency-Key", "tenant-injection-001").send({ ...farmOneRequest, code: "INJECT", tenantId: ownerB.body.tenantId }).expect(400);
    const organizationB = await request(app.getHttpServer()).post("/api/v1/organizations").set(authB).set("Idempotency-Key", "organization-b-001").send({ code: "BORG", displayName: "B Organization", legalName: "B Organization Ltd", baseCurrency: "USD" }).expect(201);
    const farmB = await request(app.getHttpServer()).post("/api/v1/farms").set(authB).set("Idempotency-Key", "farm-b-one-001").send({ organizationId: organizationB.body.id, code: "BFARM", displayName: "B Farm", timezone: "UTC" }).expect(201);
    await request(app.getHttpServer()).get(`/api/v1/farms/${farmB.body.id}`).set(authA).expect(404);
    const audit = await request(app.getHttpServer()).get("/api/v1/audit?limit=100").set(authA).set("X-Correlation-Id", "m03-golden-path").expect(200);
    expect((audit.body as Array<{ action: string }>).some((entry) => entry.action === "farm.created")).toBe(true);
    expect(audit.headers["x-correlation-id"]).toBe("m03-golden-path");

    const badPassword = await request(app.getHttpServer()).post("/api/v1/auth/login").send({ email: "worker-a@example.com", password: "wrong password" }).expect(401);
    const unknownAccount = await request(app.getHttpServer()).post("/api/v1/auth/login").send({ email: "unknown@example.com", password: "wrong password" }).expect(401);
    expect(unknownAccount.body.message).toBe(badPassword.body.message);
    await request(app.getHttpServer()).get(`/api/v1/farms/${farmOne.body.id}`).set("Authorization", "Bearer invalid-session-token").expect(401);
    await request(app.getHttpServer()).post("/api/v1/auth/logout").set(authWorker).expect(204);
    await request(app.getHttpServer()).get(`/api/v1/farms/${farmOne.body.id}`).set(authWorker).expect(401);

    const admin = new Pool({ connectionString: database.adminUrl });
    await admin.query("update identity.users set status='DISABLED' where email='worker-a@example.com'");
    await admin.end();
    await request(app.getHttpServer()).post("/api/v1/auth/login").send({ email: "worker-a@example.com", password: "worker password 12345" }).expect(401);
  });
});
