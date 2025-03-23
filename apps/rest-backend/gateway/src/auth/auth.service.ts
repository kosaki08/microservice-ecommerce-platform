import { Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import type { LoginDto } from "./dto/login.dto";
import type { RegisterDto } from "./dto/register.dto";
import type { RefreshTokenDto } from "./dto/refresh-token.dto";
import type { User } from "@/src/auth/types/user";

interface JwtPayload {
  sub: string;
  email?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: Logger = new Logger(AuthService.name),
    @Inject("USER_SERVICE") private readonly userServiceClient: ClientProxy,
  ) {}

  public async login(loginDto: LoginDto): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const user = await firstValueFrom<User>(this.userServiceClient.send("auth.validate", loginDto));

      if (!user) {
        throw new UnauthorizedException("Invalid credentials");
      }

      const tokens = await this.generateTokens(user);

      return {
        user,
        ...tokens,
      };
    } catch (error: unknown) {
      this.logger.error(`Failed to login: ${error instanceof Error ? error.message : "Unknown error"}`);
      throw new UnauthorizedException("Invalid credentials");
    }
  }

  public async register(registerDto: RegisterDto): Promise<User> {
    return await firstValueFrom<User>(this.userServiceClient.send("auth.register", registerDto));
  }

  public async refresh(refreshTokenDto: RefreshTokenDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const decoded = await this.jwtService.verifyAsync<JwtPayload>(refreshTokenDto.refreshToken, {
        secret: this.configService.get<string>("jwt.refreshSecret"),
      });

      const user = await firstValueFrom<User>(this.userServiceClient.send("auth.findById", { id: decoded.sub }));

      if (!user) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      return await this.generateTokens(user);
    } catch (error: unknown) {
      this.logger.error(`Failed to refresh token: ${error instanceof Error ? error.message : "Unknown error"}`);
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  public async logout(user: User): Promise<void> {
    await firstValueFrom<void>(this.userServiceClient.send("auth.logout", { userId: user.id }));
  }

  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: user.id, email: user.email },
        {
          secret: this.configService.get<string>("jwt.secret"),
          expiresIn: this.configService.get<string>("jwt.expiresIn"),
        },
      ),
      this.jwtService.signAsync(
        { sub: user.id },
        {
          secret: this.configService.get<string>("jwt.refreshSecret"),
          expiresIn: this.configService.get<string>("jwt.refreshExpiresIn"),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
