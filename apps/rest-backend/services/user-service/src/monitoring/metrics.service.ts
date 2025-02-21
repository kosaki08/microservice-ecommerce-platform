import { Injectable } from "@nestjs/common";
import { Counter, Gauge, Registry } from "prom-client";

@Injectable()
export class MetricsService {
  private readonly registry: Registry;
  private readonly httpRequestsCounter: Counter;
  private readonly activeUsersGauge: Gauge;

  constructor() {
    this.registry = new Registry();

    this.httpRequestsCounter = new Counter({
      name: "http_requests_total",
      help: "Total number of HTTP requests",
      labelNames: ["method", "path", "status"],
    });

    this.activeUsersGauge = new Gauge({
      name: "active_users",
      help: "Number of active users",
    });

    this.registry.registerMetric(this.httpRequestsCounter);
    this.registry.registerMetric(this.activeUsersGauge);
  }

  incrementHttpRequests(method: string, path: string, status: number): void {
    this.httpRequestsCounter.inc({ method, path, status: status.toString() });
  }

  setActiveUsers(count: number): void {
    this.activeUsersGauge.set(count);
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
