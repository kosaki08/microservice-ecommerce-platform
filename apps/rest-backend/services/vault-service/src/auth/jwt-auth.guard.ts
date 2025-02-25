import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers["authorization"];

    // Gateway側での検証済みを前提とし、ヘッダーの存在確認のみ行う
    if (!authHeader) {
      throw new UnauthorizedException("Authorization header is missing");
    }

    return true;
  }
}
