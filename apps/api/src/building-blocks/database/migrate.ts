import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../../config.js";

const pool = new Pool({ connectionString: loadConfig().databaseUrl, application_name: "farmos-migrator" });
try {
  await migrate(drizzle(pool), { migrationsFolder: fileURLToPath(new URL("../../../drizzle", import.meta.url)) });
} finally {
  await pool.end();
}
