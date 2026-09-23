import { createHash } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import type { Database } from "../database/database.service.js";
import { DatabaseService } from "../database/database.service.js";
import { AppError } from "../http/app-error.js";
import { newId } from "../ids/uuid.js";
import { idempotencyRecords } from "./schema.js";

@Injectable()
export class IdempotencyService {
  constructor(private readonly database: DatabaseService) {}

  execute<T extends Record<string, unknown>>(input: { tenantId: string; principalId: string; operation: string; key: string; payload: unknown }, work: (db: Database) => Promise<T>): Promise<T> {
    if (!/^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$/.test(input.key)) throw new AppError(400, "VALIDATION_FAILED", "A valid Idempotency-Key is required.");
    const fingerprint = createHash("sha256").update(this.canonical(input.payload)).digest("hex");
    return this.database.runInTenantTransaction(input.tenantId, async (db, client) => {
      const inserted = await db.insert(idempotencyRecords).values({
        id: newId(), tenantId: input.tenantId, principalId: input.principalId,
        operation: input.operation, key: input.key, fingerprint, status: "IN_PROGRESS", result: null, createdAt: new Date(), completedAt: null,
      }).onConflictDoNothing().returning({ id: idempotencyRecords.id });

      if (inserted.length === 0) {
        await client.query("select id from integration.idempotency_records where tenant_id=$1 and principal_id=$2 and operation=$3 and key=$4 for update", [input.tenantId, input.principalId, input.operation, input.key]);
        const [existing] = await db.select().from(idempotencyRecords).where(and(eq(idempotencyRecords.tenantId, input.tenantId), eq(idempotencyRecords.principalId, input.principalId), eq(idempotencyRecords.operation, input.operation), eq(idempotencyRecords.key, input.key))).limit(1);
        if (!existing) throw new AppError(409, "COMMAND_IN_PROGRESS", "The command is still being processed.");
        if (existing.fingerprint !== fingerprint) throw new AppError(409, "IDEMPOTENCY_KEY_REUSED", "The idempotency key was already used with another request.");
        if (existing.status === "COMPLETED" && existing.result) return existing.result as T;
        throw new AppError(409, "COMMAND_IN_PROGRESS", "The command is still being processed.");
      }

      const result = await work(db);
      await db.update(idempotencyRecords).set({ status: "COMPLETED", result, completedAt: new Date() }).where(and(eq(idempotencyRecords.tenantId, input.tenantId), eq(idempotencyRecords.principalId, input.principalId), eq(idempotencyRecords.operation, input.operation), eq(idempotencyRecords.key, input.key)));
      return result;
    });
  }

  private canonical(value: unknown): string {
    if (value === undefined) return "undefined";
    if (Array.isArray(value)) return `[${value.map((item) => this.canonical(item)).join(",")}]`;
    if (value !== null && typeof value === "object") return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${this.canonical(item)}`).join(",")}}`;
    return JSON.stringify(value);
  }
}
