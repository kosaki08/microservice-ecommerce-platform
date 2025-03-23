import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "@/src/app.controller";
import { AppService } from "@/src/app.service";
import { AuthModule } from "@/src/auth/auth.module";
import jwtConfig from "@/src/config/jwt.config";
import { HealthModule } from "@/src/health/health.module";
import { MonitoringModule } from "@/src/monitoring/monitoring.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [jwtConfig],
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
      cache: true,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    AuthModule,
    MonitoringModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
