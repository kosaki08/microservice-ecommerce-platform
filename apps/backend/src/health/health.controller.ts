import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckService, type HealthCheckResult, type HealthIndicatorResult } from "@nestjs/terminus";

@Controller("api/health")
export class HealthController {
  public constructor(private health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  public check(): Promise<HealthCheckResult> {
    return this.health.check([
      (): HealthIndicatorResult => ({
        api: {
          status: "up",
        },
      }),
    ]);
  }
}
