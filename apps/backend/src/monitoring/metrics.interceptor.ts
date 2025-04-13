import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { MetricsService } from "@/src/monitoring/metrics.service";

interface RouteInfo {
  path: string;
}

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  public constructor(private metricsService: MetricsService) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const method = req.method;
    const path = (req.route as RouteInfo | undefined)?.path ?? req.path ?? "unknown";

    return next.handle().pipe(
      tap({
        next: () => {
          this.metricsService.incrementHttpRequests(method, path, 200);
        },
        error: (error: { status?: number }) => {
          this.metricsService.incrementHttpRequests(method, path, error.status ?? 500);
        },
      }),
    );
  }
}
