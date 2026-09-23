import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";
import { configureHttp } from "./building-blocks/http/configure-http.js";
import { loadConfig } from "./config.js";

async function bootstrap(): Promise<void> {
  const config = loadConfig();
  const app = await NestFactory.create(AppModule);
  configureHttp(app, config);
  app.enableShutdownHooks();
  const document = SwaggerModule.createDocument(app, new DocumentBuilder().setTitle("FarmOS API").setVersion("1.0").addBearerAuth().addCookieAuth("farmos_session").build());
  SwaggerModule.setup("api/docs", app, document);
  await app.listen(config.port);
  new Logger("Bootstrap").log(`FarmOS API listening on port ${String(config.port)}`);
}

void bootstrap();
