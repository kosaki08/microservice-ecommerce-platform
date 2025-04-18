import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "@/src/app.controller";
import { AppService } from "@/src/app.service";
import { AuthModule } from "@/src/auth/auth.module";
import appConfig from "@/src/config/app.config";
import jwtConfig from "@/src/config/jwt.config";
import { HealthModule } from "@/src/health/health.module";
import { MonitoringModule } from "@/src/monitoring/monitoring.module";
import { PrismaModule } from "@/src/prisma/prisma.module";
import { UsersModule } from "@/src/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig],
      envFilePath: [".env.local", ".env"],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MonitoringModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
