import { startTelemetry } from "./building-blocks/observability/telemetry.js";

startTelemetry(process.env.OTEL_ENABLED === "true");
