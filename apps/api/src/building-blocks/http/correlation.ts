import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { Logger } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";

interface RequestContext { readonly correlationId: string }
const storage = new AsyncLocalStorage<RequestContext>();
const safeCorrelation = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const logger = new Logger("HTTP");

export const requestContext = {
  correlationId: (): string => storage.getStore()?.correlationId ?? randomUUID(),
};

export function correlationMiddleware(request: Request, response: Response, next: NextFunction): void {
  const supplied = request.header("x-correlation-id");
  const correlationId = supplied && safeCorrelation.test(supplied) ? supplied : randomUUID();
  const started = performance.now();
  response.setHeader("X-Correlation-Id", correlationId);
  response.once("finish", () => {
    logger.log({ correlationId, method: request.method, route: request.path, status: response.statusCode, durationMs: Math.round((performance.now() - started) * 100) / 100 });
  });
  storage.run({ correlationId }, next);
}
