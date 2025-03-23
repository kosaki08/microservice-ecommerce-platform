import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { Transport, type MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { MetricsInterceptor } from "./monitoring/metrics.interceptor";
import { MetricsService } from "./monitoring/metrics.service";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const metricsService = app.get(MetricsService);
  const configService = app.get(ConfigService);

  // Metrics
  app.useGlobalInterceptors(new MetricsInterceptor(metricsService));

  // Microservice (TCP) - HTTPポートとは別のポートで待ち受ける
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: configService.get<string>("user.service.host", "0.0.0.0"),
      port: configService.get<number>("user.service.port", 3051),
    },
  });

  // マイクロサービスとHTTPサーバーを起動
  await app.startAllMicroservices();
  const httpPort = configService.get<number>("user.http.port", 3001);
  await app.listen(httpPort, "0.0.0.0");
}
void bootstrap();
