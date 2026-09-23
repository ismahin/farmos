import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { newId } from "../../src/building-blocks/ids/uuid.js";
import { startTestDatabase, type TestDatabase } from "../support/postgres.js";

describe("PostgreSQL tenant isolation", () => {
  let database: TestDatabase;
  let admin: Pool;
  let runtime: Pool;
  const tenantA = newId(); const tenantB = newId(); const userId = newId();
  const organizationA = newId(); const organizationB = newId(); const farmA = newId(); const farmB = newId();

  beforeAll(async () => {
    database = await startTestDatabase();
    admin = new Pool({ connectionString: database.adminUrl });
    runtime = new Pool({ connectionString: database.runtimeUrl, max: 1 });
    const now = new Date();
    await admin.query("insert into platform.tenants(id,display_name,status,created_at,updated_at) values ($1,'A','ACTIVE',$3,$3),($2,'B','ACTIVE',$3,$3)", [tenantA, tenantB, now]);
    await admin.query("insert into identity.users(id,email,display_name,password_hash,status,created_at,updated_at) values ($1,'rls@example.com','RLS','hash','ACTIVE',$2,$2)", [userId, now]);
    await admin.query("insert into identity.memberships(id,tenant_id,user_id,status,is_tenant_owner,created_at) values ($1,$2,$3,'ACTIVE',false,$4)", [newId(), tenantA, userId, now]);
    await admin.query("insert into organization.organizations(id,tenant_id,code,display_name,status,version,created_at,created_by,updated_at,updated_by) values ($1,$3,'ORGA','Org A','ACTIVE',1,$5,$6,$5,$6),($2,$4,'ORGB','Org B','ACTIVE',1,$5,$6,$5,$6)", [organizationA, organizationB, tenantA, tenantB, now, userId]);
    await admin.query("insert into farm.farms(id,tenant_id,organization_id,code,display_name,timezone,status,version,created_at,created_by,updated_at,updated_by) values ($1,$3,$5,'FARMA','Farm A','UTC','ACTIVE',1,$7,$8,$7,$8),($2,$4,$6,'FARMB','Farm B','UTC','ACTIVE',1,$7,$8,$7,$8)", [farmA, farmB, tenantA, tenantB, organizationA, organizationB, now, userId]);
  });

  afterAll(async () => { await runtime.end(); await admin.end(); await database.container.stop(); });

  it("requires transaction-local tenant context and does not leak it through the pool", async () => {
    const client = await runtime.connect();
    await client.query("begin");
    await client.query("select set_config('app.tenant_id',$1,true)", [tenantA]);
    expect((await client.query("select tenant_id from identity.memberships")).rows).toHaveLength(1);
    await client.query("commit");
    client.release();
    expect((await runtime.query("select tenant_id from identity.memberships")).rows).toHaveLength(0);

    const readTenant = async (tenantId: string): Promise<string[]> => {
      const scoped = await runtime.connect();
      try {
        await scoped.query("begin");
        await scoped.query("select set_config('app.tenant_id',$1,true)", [tenantId]);
        const result = await scoped.query<{ tenant_id: string }>("select tenant_id from farm.farms");
        await scoped.query("commit");
        return result.rows.map((row) => row.tenant_id);
      } finally { scoped.release(); }
    };
    const [visibleA, visibleB] = await Promise.all([readTenant(tenantA), readTenant(tenantB)]);
    expect(visibleA).toEqual([tenantA]);
    expect(visibleB).toEqual([tenantB]);
    expect((await runtime.query("select tenant_id from farm.farms")).rows).toHaveLength(0);
  });

  it("denies cross-tenant select, update, delete, and guessed UUID access even without application filters", async () => {
    const client = await runtime.connect();
    try {
      await client.query("begin");
      await client.query("select set_config('app.tenant_id',$1,true)", [tenantA]);
      expect((await client.query("select id from organization.organizations")).rows.map((row: { id: string }) => row.id)).toEqual([organizationA]);
      expect((await client.query("select id from farm.farms where id=$1", [farmB])).rows).toHaveLength(0);
      expect((await client.query("update farm.farms set display_name='breach' where id=$1", [farmB])).rowCount).toBe(0);
      expect((await client.query("delete from farm.farms where id=$1", [farmB])).rowCount).toBe(0);
      await client.query("commit");
    } finally { client.release(); }
  });

  it("prevents a cross-tenant relational reference", async () => {
    const now = new Date();
    await expect(admin.query("insert into farm.farms(id,tenant_id,organization_id,code,display_name,timezone,status,version,created_at,created_by,updated_at,updated_by) values ($1,$2,$3,'BAD','Bad','UTC','ACTIVE',1,$4,$5,$4,$5)", [newId(), tenantB, organizationA, now, userId])).rejects.toMatchObject({ code: "23503" });
  });
});
