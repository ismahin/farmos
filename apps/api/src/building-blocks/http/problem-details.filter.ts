import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger, type ExceptionFilter } from "@nestjs/common";
import type { Request, Response } from "express";
import { AppError } from "./app-error.js";
import { requestContext } from "./correlation.js";

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ProblemDetailsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();
    const correlationId = requestContext.correlationId();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = "INTERNAL_FAILURE";
    let message = "An unexpected error occurred.";
    let details: Record<string, unknown> | undefined;

    if (exception instanceof AppError) {
      ({ status, code, message, details } = exception);
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const codes: Record<number, string> = { 400: "VALIDATION_FAILED", 401: "AUTHENTICATION_REQUIRED", 403: "ACTION_FORBIDDEN", 404: "RESOURCE_NOT_FOUND" };
      code = codes[status] ?? "RESOURCE_CONFLICT";
      const body = exception.getResponse();
      message = typeof body === "string" ? body : "The request could not be processed.";
      if (typeof body === "object" && "message" in body) details = { errors: body.message };
    } else {
      this.logger.error(`Unhandled request failure correlationId=${correlationId}`, exception instanceof Error ? exception.stack : undefined);
    }

    response.status(status).type("application/problem+json").json({
      type: `https://api.farmos.example/problems/${code.toLowerCase().replaceAll("_", "-")}`,
      title: code.replaceAll("_", " "), status, code, message, correlationId,
      ...(details ? { details } : {}),
      instance: request.path,
    });
  }
}
