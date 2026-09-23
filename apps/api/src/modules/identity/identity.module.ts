import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthService } from "./application/auth.service.js";
import { AuthController, MeController } from "./api/auth.controller.js";
import { AuthGuard } from "./api/auth.guard.js";
import { IdentityService } from "./application/identity.service.js";
import { RolesController, UsersController } from "./api/identity.controller.js";

@Module({
  controllers: [AuthController, MeController, UsersController, RolesController],
  providers: [AuthService, IdentityService, { provide: APP_GUARD, useClass: AuthGuard }],
  exports: [AuthService, IdentityService],
})
export class IdentityModule {}
