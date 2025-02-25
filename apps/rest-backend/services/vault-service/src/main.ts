import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/src/app.module";
import { MetricsInterceptor } from "@/src/monitoring/metrics.interceptor";
import { MetricsService } from "@/src/monitoring/metrics.service";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const metricsService = app.get(MetricsService);
  app.useGlobalInterceptors(new MetricsInterceptor(metricsService));

  await app.listen(3001, "0.0.0.0");
}
void bootstrap();
