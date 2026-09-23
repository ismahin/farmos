import type { CookieOptions, NextFunction, Request, Response } from "express";
import type { AppConfig } from "../../config.js";
import { AppError } from "./app-error.js";

export const cookieTransportHeader = "x-session-transport";
export const cookieTransportValue = "cookie";

export function sessionCookieOptions(config: AppConfig): CookieOptions {
  return {
    httpOnly: true,
    secure: config.sessionCookieSecure,
    sameSite: "lax",
    path: "/api",
    maxAge: config.sessionTtlHours * 60 * 60 * 1000,
  };
}

export function readCookie(request: Request, name: string): string | undefined {
  const header = request.header("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0 || part.slice(0, separator).trim() !== name) continue;
    try { return decodeURIComponent(part.slice(separator + 1).trim()); } catch { return undefined; }
  }
  return undefined;
}

export function wantsCookieTransport(request: Request): boolean {
  return request.header(cookieTransportHeader)?.toLowerCase() === cookieTransportValue;
}

export function browserRequestSecurity(config: AppConfig): (request: Request, response: Response, next: NextFunction) => void {
  const allowedOrigins = new Set(config.browserOrigins);
  return (request, _response, next): void => {
    if (["GET", "HEAD", "OPTIONS"].includes(request.method)) { next(); return; }
    const usesCookie = readCookie(request, config.sessionCookieName) !== undefined || wantsCookieTransport(request);
    const origin = request.header("origin");
    if ((usesCookie && !origin) || (origin && !allowedOrigins.has(origin))) {
      throw new AppError(403, "ACTION_FORBIDDEN", "The browser request origin is not allowed.");
    }
    next();
  };
}
