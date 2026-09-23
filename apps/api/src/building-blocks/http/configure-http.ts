import { ValidationPipe, type INestApplication } from "@nestjs/common";
import type { AppConfig } from "../../config.js";
import { browserRequestSecurity } from "./browser-session.js";
import { correlationMiddleware } from "./correlation.js";
import { ProblemDetailsFilter } from "./problem-details.filter.js";

export function configureHttp(app: INestApplication, config: AppConfig): void {
  app.enableCors({ origin: [...config.browserOrigins], credentials: true, methods: ["GET", "HEAD", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization", "Idempotency-Key", "If-Match", "X-Correlation-Id", "X-Session-Transport"] });
  app.use(correlationMiddleware);
  app.use(browserRequestSecurity(config));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new ProblemDetailsFilter());
}
