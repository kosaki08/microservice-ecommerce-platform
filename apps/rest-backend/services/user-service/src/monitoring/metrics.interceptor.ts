import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { MetricsService } from "./metrics.service";

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const path = req.route?.path || req.path;

    return next.handle().pipe(
      tap({
        next: () => {
          this.metricsService.incrementHttpRequests(method, path, 200);
        },
        error: (error) => {
          this.metricsService.incrementHttpRequests(method, path, error.status || 500);
        },
      }),
    );
  }
}
