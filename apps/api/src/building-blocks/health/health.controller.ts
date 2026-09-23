import { Controller, Get } from "@nestjs/common";
import { Public } from "../../modules/identity/api/auth.decorators.js";
import { DatabaseService } from "../database/database.service.js";

@Controller("api/v1/health")
export class HealthController {
  constructor(private readonly database: DatabaseService) {}

  @Public()
  @Get("live")
  live(): { status: "ok" } { return { status: "ok" }; }

  @Public()
  @Get("ready")
  async ready(): Promise<{ status: "ready" }> {
    await this.database.queryGlobal("select 1");
    return { status: "ready" };
  }
}
