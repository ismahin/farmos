import { Body, Controller, Get, Headers, Param, Patch, Post, Query, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { AppError } from "../../../building-blocks/http/app-error.js";
import type { SessionPrincipalData } from "../../identity/application/auth.service.js";
import { CurrentPrincipal, RequirePermissions } from "../../identity/api/auth.decorators.js";
import { Permissions } from "../../identity/domain/permissions.js";
import { FarmService, type FarmView } from "../application/farm.service.js";
import { CreateFarmDto, FarmResponseDto, ListFarmsQuery, UpdateFarmDto } from "./farm.dto.js";

@ApiTags("Farms") @ApiBearerAuth() @ApiCookieAuth() @Controller("api/v1/farms")
export class FarmController {
  constructor(private readonly service: FarmService) {}
  @Post() @RequirePermissions(Permissions.FarmCreate) @ApiHeader({ name: "Idempotency-Key", required: true }) @ApiCreatedResponse({ type: FarmResponseDto })
  create(@CurrentPrincipal() principal: SessionPrincipalData, @Headers("idempotency-key") key: string | undefined, @Body() body: CreateFarmDto): Promise<FarmView> { return this.service.create(principal, key ?? "", body); }
  @Get() @RequirePermissions(Permissions.FarmRead) @ApiOkResponse({ description: "Bounded cursor page of accessible farms." })
  list(@CurrentPrincipal() principal: SessionPrincipalData, @Query() query: ListFarmsQuery): Promise<{ items: FarmView[]; page: { nextCursor: string | null; hasMore: boolean } }> { return this.service.list(principal, query.pageSize ?? 25, query.cursor); }
  @Get(":id") @RequirePermissions(Permissions.FarmRead) @ApiOkResponse({ type: FarmResponseDto })
  async get(@CurrentPrincipal() principal: SessionPrincipalData, @Param("id") id: string, @Res({ passthrough: true }) response: Response): Promise<FarmView> { const item = await this.service.get(principal, id); response.setHeader("ETag", `"${String(item.version)}"`); return item; }
  @Patch(":id") @RequirePermissions(Permissions.FarmUpdate) @ApiHeader({ name: "If-Match", required: true }) @ApiOkResponse({ type: FarmResponseDto })
  async update(@CurrentPrincipal() principal: SessionPrincipalData, @Param("id") id: string, @Headers("if-match") etag: string | undefined, @Body() body: UpdateFarmDto, @Res({ passthrough: true }) response: Response): Promise<FarmView> {
    const expected = Number(etag?.replaceAll('"', "")); if (!Number.isSafeInteger(expected) || expected < 1) throw new AppError(400, "VALIDATION_FAILED", "A valid If-Match ETag is required.");
    const item = await this.service.update(principal, id, expected, body); response.setHeader("ETag", `"${String(item.version)}"`); return item;
  }
}
