import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "@/src/app.controller";
import { AppService } from "@/src/app.service";
import { AuthModule } from "@/src/auth/auth.module";
import appConfig from "@/src/config/app.config";
import { HealthModule } from "@/src/health/health.module";
import { MonitoringModule } from "@/src/monitoring/monitoring.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: [".env.local", ".env"],
    }),
    AuthModule,
    MonitoringModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
