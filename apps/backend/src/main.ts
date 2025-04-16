import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MetricsInterceptor } from "./monitoring/metrics.interceptor";
import { MetricsService } from "./monitoring/metrics.service";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const metricsService = app.get(MetricsService);
  const configService = app.get(ConfigService);

  // グローバルプレフィックスを設定
  app.setGlobalPrefix("api/v1", {
    exclude: ["health", "metrics"], // '/health', '/metrics' パスはプレフィックスの対象外に
  });

  // Metrics
  app.useGlobalInterceptors(new MetricsInterceptor(metricsService));

  // HTTPサーバーを起動
  const httpPort = configService.get<number>("app.http.port", 8080);
  await app.listen(httpPort, "0.0.0.0");
}
void bootstrap();
