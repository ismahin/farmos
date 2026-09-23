import { createParamDecorator, SetMetadata, type ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import type { SessionPrincipalData } from "../application/auth.service.js";

export const IS_PUBLIC = Symbol("isPublic");
export const REQUIRED_PERMISSIONS = Symbol("requiredPermissions");
export const Public = (): MethodDecorator & ClassDecorator => SetMetadata(IS_PUBLIC, true);
export const RequirePermissions = (...permissions: string[]): MethodDecorator & ClassDecorator => SetMetadata(REQUIRED_PERMISSIONS, permissions);

interface AuthenticatedRequest extends Request { principal?: SessionPrincipalData }
export const CurrentPrincipal = createParamDecorator((_data: unknown, context: ExecutionContext): SessionPrincipalData => {
  const principal = context.switchToHttp().getRequest<AuthenticatedRequest>().principal;
  if (!principal) throw new Error("Authenticated principal missing");
  return principal;
});
