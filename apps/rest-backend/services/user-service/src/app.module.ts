import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HealthModule } from "./health/health.module";
import { MonitoringModule } from "./monitoring/monitoring.module";

@Module({
  imports: [MonitoringModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
