import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function start() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // ✅ Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("Bulivard API")
    .setDescription("API documentation for the restaurant reservation system")
    .setVersion("1.0")
    .addBearerAuth() // Enables JWT token auth in Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document); // Access Swagger at /api

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.clear();
  console.log("\x1b[36m%s\x1b[0m", "🚀 Server is running!");
  console.log("\x1b[32m%s\x1b[0m", `📡 Listening on: http://localhost:${port}`);
  console.log(
    "\x1b[33m%s\x1b[0m",
    `📘 Swagger docs: http://localhost:${port}/api`
  );
}
start();
