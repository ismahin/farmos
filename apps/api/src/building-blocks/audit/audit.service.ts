import { Injectable } from "@nestjs/common";
import type { Database } from "../database/database.service.js";
import { requestContext } from "../http/correlation.js";
import { newId } from "../ids/uuid.js";
import { auditRecords, type AuditChange } from "./schema.js";

@Injectable()
export class AuditService {
  async append(db: Database, input: { tenantId: string; actorId?: string; action: string; entityType: string; entityId?: string; change?: AuditChange; source?: string }): Promise<void> {
    await db.insert(auditRecords).values({
      id: newId(), tenantId: input.tenantId, actorId: input.actorId ?? null,
      action: input.action, entityType: input.entityType, entityId: input.entityId ?? null,
      occurredAt: new Date(), correlationId: requestContext.correlationId(), source: input.source ?? "API",
      change: input.change ?? null,
    });
  }
}
