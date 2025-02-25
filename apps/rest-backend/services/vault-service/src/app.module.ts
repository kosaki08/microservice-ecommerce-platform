import { Module } from "@nestjs/common";
import { AppController } from "@/src/app.controller";
import { AppService } from "@/src/app.service";
import { HealthModule } from "@/src/health/health.module";
import { MonitoringModule } from "@/src/monitoring/monitoring.module";

@Module({
  imports: [MonitoringModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
