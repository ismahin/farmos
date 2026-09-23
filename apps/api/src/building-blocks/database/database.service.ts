import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { loadConfig } from "../../config.js";
import * as schema from "./schema.js";

export type Database = NodePgDatabase<typeof schema>;

export interface BootstrapTransaction {
  readonly db: Database;
  setTenant(tenantId: string): Promise<void>;
}

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  readonly pool: Pool;

  constructor() {
    const config = loadConfig();
    this.pool = new Pool({ connectionString: config.databaseUrl, max: 20, application_name: "farmos-api" });
  }

  async onApplicationShutdown(): Promise<void> { await this.pool.end(); }

  async queryGlobal<T extends QueryResultRow>(text: string, values: readonly unknown[] = []): Promise<readonly T[]> {
    const result = await this.pool.query<T>(text, [...values]);
    return result.rows;
  }

  async runInTenantTransaction<T>(tenantId: string, work: (db: Database, client: PoolClient) => Promise<T>): Promise<T> {
    return this.runTransaction(async (db, client) => {
      await client.query("select set_config('app.tenant_id', $1, true)", [tenantId]);
      return work(db, client);
    });
  }

  async runInBootstrapTransaction<T>(work: (transaction: BootstrapTransaction) => Promise<T>): Promise<T> {
    return this.runTransaction((db, client) => work({
      db,
      setTenant: async (tenantId: string): Promise<void> => {
        await client.query("select set_config('app.tenant_id', $1, true)", [tenantId]);
      },
    }));
  }

  private async runTransaction<T>(work: (db: Database, client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      const db = drizzle(client, { schema });
      const result = await work(db, client);
      await client.query("commit");
      return result;
    } catch (error: unknown) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }
}
