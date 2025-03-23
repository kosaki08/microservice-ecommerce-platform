import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "@/src/app.module";
import { MetricsInterceptor } from "@/src/monitoring/metrics.interceptor";
import { MetricsService } from "@/src/monitoring/metrics.service";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("app.port") ?? 3000;

  // Swagger API Docs
  const config = new DocumentBuilder().setTitle("API Gateway").build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  // Metrics
  const metricsService = app.get(MetricsService);
  app.useGlobalInterceptors(new MetricsInterceptor(metricsService));

  // Validation Pipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, "0.0.0.0");
}
void bootstrap();
