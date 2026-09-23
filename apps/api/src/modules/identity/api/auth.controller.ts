import { Body, Controller, Get, Headers, HttpCode, Post, Req, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiCreatedResponse, ApiExtraModels, ApiHeader, ApiOkResponse, ApiTags, getSchemaPath } from "@nestjs/swagger";
import type { Request, Response } from "express";
import { loadConfig } from "../../../config.js";
import { sessionCookieOptions, wantsCookieTransport } from "../../../building-blocks/http/browser-session.js";
import { AuthService, type SessionPrincipalData, type SessionResult } from "../application/auth.service.js";
import { CurrentPrincipal, Public } from "./auth.decorators.js";
import { BootstrapResultDto, BrowserBootstrapDto, BrowserSessionDto, LoginDto, MeDto, RegisterDto, SessionTokenDto } from "./auth.dto.js";

@ApiTags("Authentication")
@ApiExtraModels(BootstrapResultDto, BrowserBootstrapDto, SessionTokenDto, BrowserSessionDto)
@Controller("api/v1/auth")
export class AuthController {
  private readonly config = loadConfig();
  constructor(private readonly auth: AuthService) {}

  @Public() @Post("register") @ApiHeader({ name: "X-Bootstrap-Token", required: true }) @ApiHeader({ name: "X-Session-Transport", required: false, enum: ["cookie"] }) @ApiCreatedResponse({ schema: { oneOf: [{ $ref: getSchemaPath(BootstrapResultDto) }, { $ref: getSchemaPath(BrowserBootstrapDto) }] } })
  async register(@Body() body: RegisterDto, @Headers("x-bootstrap-token") bootstrapToken: string | undefined, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<(SessionResult & { tenantId: string; userId: string }) | BrowserBootstrapDto> {
    response.setHeader("Cache-Control", "no-store");
    const result = await this.auth.bootstrap({ displayName: body.displayName, email: body.email, password: body.password, ...(bootstrapToken ? { bootstrapToken } : {}) });
    if (!wantsCookieTransport(request)) return result;
    response.cookie(this.config.sessionCookieName, result.accessToken, sessionCookieOptions(this.config));
    return { authenticated: true, expiresAt: result.expiresAt, tenantId: result.tenantId, userId: result.userId };
  }

  @Public() @HttpCode(200) @Post("login") @ApiHeader({ name: "X-Session-Transport", required: false, enum: ["cookie"] }) @ApiOkResponse({ schema: { oneOf: [{ $ref: getSchemaPath(SessionTokenDto) }, { $ref: getSchemaPath(BrowserSessionDto) }] } })
  async login(@Body() body: LoginDto, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<SessionResult | BrowserSessionDto> {
    response.setHeader("Cache-Control", "no-store");
    const result = await this.auth.login(body.email, body.password);
    if (!wantsCookieTransport(request)) return result;
    response.cookie(this.config.sessionCookieName, result.accessToken, sessionCookieOptions(this.config));
    return { authenticated: true, expiresAt: result.expiresAt } satisfies BrowserSessionDto;
  }

  @ApiBearerAuth() @ApiCookieAuth() @HttpCode(204) @Post("logout")
  async logout(@CurrentPrincipal() principal: SessionPrincipalData, @Res({ passthrough: true }) response: Response): Promise<void> {
    response.setHeader("Cache-Control", "no-store");
    await this.auth.logout(principal);
    response.clearCookie(this.config.sessionCookieName, sessionCookieOptions(this.config));
  }
}

@ApiTags("Identity")
@ApiBearerAuth()
@ApiCookieAuth()
@Controller("api/v1/me")
export class MeController {
  constructor(private readonly auth: AuthService) {}
  @Get()
  @ApiOkResponse({ type: MeDto })
  get(@CurrentPrincipal() principal: SessionPrincipalData, @Res({ passthrough: true }) response: Response): Promise<Record<string, unknown>> {
    response.setHeader("Cache-Control", "no-store");
    return this.auth.getMe(principal);
  }
}
