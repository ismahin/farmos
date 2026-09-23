import { Injectable } from "@nestjs/common";
import type { Database } from "../database/database.service.js";
import { requestContext } from "../http/correlation.js";
import { newId } from "../ids/uuid.js";
import { outboxMessages } from "../idempotency/schema.js";

@Injectable()
export class OutboxService {
  async append(db: Database, input: { tenantId: string; eventType: string; subjectType: string; subjectId: string; payload: Record<string, unknown> }): Promise<void> {
    await db.insert(outboxMessages).values({
      id: newId(), tenantId: input.tenantId, eventType: input.eventType, schemaVersion: "1",
      subjectType: input.subjectType, subjectId: input.subjectId,
      correlationId: requestContext.correlationId(), causationId: null, payload: input.payload,
      occurredAt: new Date(), publishedAt: null,
    });
  }
}
