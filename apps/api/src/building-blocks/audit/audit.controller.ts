import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { asc, eq } from "drizzle-orm";
import type { SessionPrincipalData } from "../../modules/identity/application/auth.service.js";
import { CurrentPrincipal, RequirePermissions } from "../../modules/identity/api/auth.decorators.js";
import { DatabaseService } from "../database/database.service.js";
import { auditRecords } from "./schema.js";

@ApiTags("Audit") @ApiBearerAuth() @ApiCookieAuth() @Controller("api/v1/audit")
export class AuditController {
  constructor(private readonly database: DatabaseService) {}

  @Get()
  @RequirePermissions("users.read")
  list(@CurrentPrincipal() principal: SessionPrincipalData, @Query("limit") rawLimit?: string): Promise<readonly Record<string, unknown>[]> {
    const parsed = Number(rawLimit ?? "50");
    const limit = Number.isInteger(parsed) ? Math.min(Math.max(parsed, 1), 100) : 50;
    return this.database.runInTenantTransaction(principal.tenantId, async (db) => db.select().from(auditRecords).where(eq(auditRecords.tenantId, principal.tenantId)).orderBy(asc(auditRecords.occurredAt)).limit(limit));
  }
}
