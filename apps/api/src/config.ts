export interface AppConfig {
  readonly nodeEnv: string;
  readonly port: number;
  readonly databaseUrl: string;
  readonly bootstrapToken?: string;
  readonly sessionTtlHours: number;
  readonly otelEnabled: boolean;
  readonly browserOrigins: readonly string[];
  readonly sessionCookieName: string;
  readonly sessionCookieSecure: boolean;
}

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): AppConfig {
  const databaseUrl = environment.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required");
  const port = Number(environment.PORT ?? "3001");
  const sessionTtlHours = Number(environment.SESSION_TTL_HOURS ?? "12");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be a valid port");
  if (!Number.isInteger(sessionTtlHours) || sessionTtlHours < 1) throw new Error("SESSION_TTL_HOURS must be a positive integer");
  const bootstrapToken = environment.BOOTSTRAP_TOKEN;
  const nodeEnv = environment.NODE_ENV ?? "development";
  const configuredOrigins = environment.WEB_ORIGINS?.split(",").map((origin) => origin.trim()).filter((origin) => origin.length > 0);
  const browserOrigins = configuredOrigins?.length ? configuredOrigins : nodeEnv === "production" ? [] : ["http://localhost:3000"];
  if (nodeEnv === "production" && browserOrigins.length === 0) throw new Error("WEB_ORIGINS is required in production");
  for (const origin of browserOrigins) {
    const parsed = new URL(origin);
    if (parsed.origin !== origin || (nodeEnv === "production" && parsed.protocol !== "https:")) throw new Error("WEB_ORIGINS must contain exact origins and use HTTPS in production");
  }
  return {
    nodeEnv,
    port,
    databaseUrl,
    ...(bootstrapToken ? { bootstrapToken } : {}),
    sessionTtlHours,
    otelEnabled: environment.OTEL_ENABLED === "true",
    browserOrigins,
    sessionCookieName: environment.SESSION_COOKIE_NAME ?? "farmos_session",
    sessionCookieSecure: nodeEnv === "production",
  };
}
