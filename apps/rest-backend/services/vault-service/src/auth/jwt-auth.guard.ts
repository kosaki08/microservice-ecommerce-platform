import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";
import { Request } from "express";

interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Authorization header is missing or invalid");
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>("JWT_SECRET_KEY"),
      });

      request.user = payload;
    } catch (error) {
      throw this.handleJwtError(error);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(" ");
    return type === "Bearer" ? token : undefined;
  }

  private handleJwtError(error: unknown): UnauthorizedException {
    let message = "Invalid token";

    if (error instanceof TokenExpiredError) {
      message = "Token has expired";
    } else if (error instanceof JsonWebTokenError) {
      message = "Malformed token";
    }

    return new UnauthorizedException({
      statusCode: 401,
      message,
      error: "Unauthorized",
    });
  }
}
