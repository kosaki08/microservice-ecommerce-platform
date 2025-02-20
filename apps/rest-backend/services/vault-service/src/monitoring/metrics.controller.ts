import { Controller, Get } from "@nestjs/common";
import { MetricsService } from "./metrics.service";

@Controller("metrics")
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async getMetrics(): Promise<string> {
    return await this.metricsService.getMetrics();
  }
}
