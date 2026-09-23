import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import type { SessionPrincipalData } from "../application/auth.service.js";
import { IdentityService } from "../application/identity.service.js";
import { CurrentPrincipal, RequirePermissions } from "./auth.decorators.js";
import { AssignFarmDto, AssignRoleDto, CreateUserDto } from "./auth.dto.js";
import { Permissions } from "../domain/permissions.js";

@ApiTags("Users") @ApiBearerAuth() @ApiCookieAuth() @Controller("api/v1/users")
export class UsersController {
  constructor(private readonly service: IdentityService) {}
  @Get() @RequirePermissions(Permissions.UsersRead)
  list(@CurrentPrincipal() principal: SessionPrincipalData): Promise<readonly Record<string, unknown>[]> { return this.service.listUsers(principal); }
  @Post() @RequirePermissions(Permissions.UsersManage)
  create(@CurrentPrincipal() principal: SessionPrincipalData, @Body() body: CreateUserDto): Promise<Record<string, unknown>> { return this.service.createUser(principal, body); }
  @Post(":id/role-assignments") @HttpCode(204) @RequirePermissions(Permissions.RolesManage)
  async assignRole(@CurrentPrincipal() principal: SessionPrincipalData, @Param("id") id: string, @Body() body: AssignRoleDto): Promise<void> { await this.service.assignRole(principal, id, body.roleId); }
  @Post(":id/farm-assignments") @HttpCode(204) @RequirePermissions(Permissions.UsersManage)
  async assignFarm(@CurrentPrincipal() principal: SessionPrincipalData, @Param("id") id: string, @Body() body: AssignFarmDto): Promise<void> { await this.service.assignFarm(principal, id, body.farmId); }
}

@ApiTags("Roles") @ApiBearerAuth() @ApiCookieAuth() @Controller("api/v1/roles")
export class RolesController {
  constructor(private readonly service: IdentityService) {}
  @Get() @RequirePermissions(Permissions.RolesRead)
  list(@CurrentPrincipal() principal: SessionPrincipalData): Promise<readonly Record<string, unknown>[]> { return this.service.listRoles(principal); }
}
