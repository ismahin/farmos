import { Global, Module } from "@nestjs/common";
import { AuditModule } from "./audit/audit.module.js";
import { OutboxService } from "./events/outbox.service.js";
import { IdempotencyService } from "./idempotency/idempotency.service.js";

@Global()
@Module({ imports: [AuditModule], providers: [IdempotencyService, OutboxService], exports: [IdempotencyService, OutboxService] })
export class FoundationModule {}
