import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MetricsInterceptor } from "./monitoring/metrics.interceptor";
import { MetricsService } from "./monitoring/metrics.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const metricsService = app.get(MetricsService);
  app.useGlobalInterceptors(new MetricsInterceptor(metricsService));

  await app.listen(3001, "0.0.0.0");
}
bootstrap();
