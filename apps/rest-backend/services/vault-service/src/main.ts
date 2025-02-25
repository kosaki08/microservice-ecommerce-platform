import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/src/app.module";
import { MetricsInterceptor } from "@/src/monitoring/metrics.interceptor";
import { MetricsService } from "@/src/monitoring/metrics.service";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("app.port") ?? 3010;

  const metricsService = app.get(MetricsService);
  app.useGlobalInterceptors(new MetricsInterceptor(metricsService));

  await app.listen(port, "0.0.0.0");
}
void bootstrap();
