import { Body, Controller, Get, Headers, Param, Patch, Post, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import type { SessionPrincipalData } from "../../identity/application/auth.service.js";
import { CurrentPrincipal, RequirePermissions } from "../../identity/api/auth.decorators.js";
import { Permissions } from "../../identity/domain/permissions.js";
import { OrganizationService, type OrganizationView } from "../application/organization.service.js";
import { CreateOrganizationDto, OrganizationResponseDto, UpdateOrganizationDto } from "./organization.dto.js";
import { AppError } from "../../../building-blocks/http/app-error.js";

@ApiTags("Organizations") @ApiBearerAuth() @ApiCookieAuth() @Controller("api/v1/organizations")
export class OrganizationController {
  constructor(private readonly service: OrganizationService) {}
  @Post() @RequirePermissions(Permissions.OrganizationManage) @ApiHeader({ name: "Idempotency-Key", required: true }) @ApiCreatedResponse({ type: OrganizationResponseDto })
  create(@CurrentPrincipal() principal: SessionPrincipalData, @Headers("idempotency-key") key: string | undefined, @Body() body: CreateOrganizationDto): Promise<OrganizationView> {
    return this.service.create(principal, key ?? "", body);
  }
  @Get(":id") @RequirePermissions(Permissions.OrganizationRead) @ApiOkResponse({ type: OrganizationResponseDto })
  async get(@CurrentPrincipal() principal: SessionPrincipalData, @Param("id") id: string, @Res({ passthrough: true }) response: Response): Promise<OrganizationView> {
    const item = await this.service.get(principal, id); response.setHeader("ETag", `"${String(item.version)}"`); return item;
  }
  @Patch(":id") @RequirePermissions(Permissions.OrganizationManage) @ApiHeader({ name: "If-Match", required: true }) @ApiOkResponse({ type: OrganizationResponseDto })
  async update(@CurrentPrincipal() principal: SessionPrincipalData, @Param("id") id: string, @Headers("if-match") etag: string | undefined, @Body() body: UpdateOrganizationDto, @Res({ passthrough: true }) response: Response): Promise<OrganizationView> {
    const expected = Number(etag?.replaceAll('"', "")); if (!Number.isSafeInteger(expected) || expected < 1) throw new AppError(400, "VALIDATION_FAILED", "A valid If-Match ETag is required.");
    const item = await this.service.update(principal, id, expected, body.displayName); response.setHeader("ETag", `"${String(item.version)}"`); return item;
  }
}
