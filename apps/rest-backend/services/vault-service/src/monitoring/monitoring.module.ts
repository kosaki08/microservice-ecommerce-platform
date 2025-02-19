import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { MetricsController } from "./metrics.controller";
import { MetricsService } from "./metrics.service";

@Module({
  imports: [TerminusModule],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MonitoringModule {}
