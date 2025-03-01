import { Controller, Get } from "@nestjs/common";
import { MetricsService } from "@/src/monitoring/metrics.service";

@Controller("metrics")
export class MetricsController {
  public constructor(private readonly metricsService: MetricsService) {}

  @Get()
  public async getMetrics(): Promise<string> {
    return await this.metricsService.getMetrics();
  }
}
