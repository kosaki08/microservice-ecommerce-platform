import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { MetricsController } from "@/src/monitoring/metrics.controller";
import { MetricsService } from "@/src/monitoring/metrics.service";

@Module({
  imports: [TerminusModule],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MonitoringModule {}
