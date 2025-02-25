import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "@/src/app.controller";
import { AppService } from "@/src/app.service";
import vaultConfig from "@/src/config/vault.config";
import { HealthModule } from "@/src/health/health.module";
import { MonitoringModule } from "@/src/monitoring/monitoring.module";
import { SecretsModule } from "@/src/secrets/secrets.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [vaultConfig],
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
      cache: true,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),
    MonitoringModule,
    HealthModule,
    SecretsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
