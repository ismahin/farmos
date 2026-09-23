import { Module } from "@nestjs/common";
import { AuditModule } from "./building-blocks/audit/audit.module.js";
import { DatabaseModule } from "./building-blocks/database/database.module.js";
import { FoundationModule } from "./building-blocks/foundation.module.js";
import { HealthModule } from "./building-blocks/health/health.module.js";
import { FarmModule } from "./modules/farm/farm.module.js";
import { IdentityModule } from "./modules/identity/identity.module.js";
import { OrganizationModule } from "./modules/organization/organization.module.js";
import { PlatformModule } from "./modules/platform/platform.module.js";

@Module({ imports: [DatabaseModule, FoundationModule, AuditModule, PlatformModule, IdentityModule, OrganizationModule, FarmModule, HealthModule] })
export class AppModule {}
