import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { AppError } from "../../../building-blocks/http/app-error.js";
import { readCookie } from "../../../building-blocks/http/browser-session.js";
import { loadConfig } from "../../../config.js";
import { tenantContext } from "../../../building-blocks/tenancy/tenant-context.js";
import { AuthService, type SessionPrincipalData } from "../application/auth.service.js";
import { IS_PUBLIC, REQUIRED_PERMISSIONS } from "./auth.decorators.js";

interface AuthenticatedRequest extends Request { principal?: SessionPrincipalData }

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly config = loadConfig();
  constructor(private readonly reflector: Reflector, private readonly auth: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [context.getHandler(), context.getClass()])) return true;
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.header("authorization");
    const bearerToken = authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;
    const token = bearerToken ?? readCookie(request, this.config.sessionCookieName);
    if (!token) throw new AppError(401, "AUTHENTICATION_REQUIRED", "Authentication is required.");
    const principal = await this.auth.resolveSession(token);
    if (!principal) throw new AppError(401, "AUTHENTICATION_REQUIRED", "The session is invalid or expired.");
    const required = this.reflector.getAllAndOverride<readonly string[] | undefined>(REQUIRED_PERMISSIONS, [context.getHandler(), context.getClass()]) ?? [];
    if (required.some((permission) => !principal.permissions.has(permission))) throw new AppError(403, "ACTION_FORBIDDEN", "The action is not permitted.");
    request.principal = principal;
    tenantContext.enter(principal);
    return true;
  }
}
