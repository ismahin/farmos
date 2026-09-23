import { Module } from "@nestjs/common";
import { FarmService } from "./application/farm.service.js";
import { FarmController } from "./api/farm.controller.js";

@Module({ controllers: [FarmController], providers: [FarmService], exports: [FarmService] })
export class FarmModule {}
