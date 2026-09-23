import { fileURLToPath } from "node:url";
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

export interface TestDatabase {
  readonly container: StartedPostgreSqlContainer;
  readonly adminUrl: string;
  readonly runtimeUrl: string;
}

export async function startTestDatabase(): Promise<TestDatabase> {
  const container = await new PostgreSqlContainer("postgres:17-alpine").start();
  const adminUrl = container.getConnectionUri();
  const admin = new Pool({ connectionString: adminUrl });
  await migrate(drizzle(admin), { migrationsFolder: fileURLToPath(new URL("../../drizzle", import.meta.url)) });
  const password = "test-runtime-password";
  await admin.query("CREATE ROLE farmos_test_runtime LOGIN PASSWORD 'test-runtime-password' IN ROLE farmos_runtime");
  await admin.end();
  const url = new URL(adminUrl);
  url.username = "farmos_test_runtime";
  url.password = password;
  return { container, adminUrl, runtimeUrl: url.toString() };
}
