import { ConflictException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { JwtPayload, User } from "@portfolio-2025/shared";
import * as bcrypt from "bcryptjs";
import type { LoginDto } from "@/src/auth/dto/login.dto";
import type { RefreshTokenDto } from "@/src/auth/dto/refresh-token.dto";
import type { RegisterDto } from "@/src/auth/dto/register.dto";
import { PrismaService } from "@/src/prisma/prisma.service";

interface JwtRefreshPayload {
  sub: string; // ユーザーID
}

@Injectable()
export class AuthService {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly logger: Logger = new Logger(AuthService.name),
  ) {}

  /**
   * ユーザーの新規登録を行います
   * @param registerDto
   * @returns
   */
  public async register(registerDto: RegisterDto): Promise<User> {
    this.logger.log(`Attempting registration for email: ${registerDto.email}`);

    const existingAccount = await this.prisma.account.findUnique({
      where: { email: registerDto.email },
    });

    if (existingAccount) {
      this.logger.warn(`Registration failed: Email ${registerDto.email} already exists.`);
      throw new ConflictException("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    try {
      const newAccount = await this.prisma.account.create({
        data: {
          email: registerDto.email,
          password_hash: hashedPassword,
          status: "ACTIVE", // デフォルトステータス
          profile: {
            create: {
              first_name: registerDto.firstName,
              last_name: registerDto.lastName,
            },
          },
        },
        include: {
          profile: true, // 作成したプロフィールを含める
        },
      });

      if (!newAccount.profile) {
        // create文によってこれは起こらないはず
        this.logger.error(`Profile creation failed for account ID: ${newAccount.id}`);
        throw new Error("User profile could not be created");
      }

      this.logger.log(`Registration successful for email: ${registerDto.email}, User ID: ${newAccount.id}`);
      // パスワードハッシュを除いたユーザーデータを返す
      return {
        id: newAccount.id,
        email: newAccount.email,
        firstName: newAccount.profile.first_name,
        lastName: newAccount.profile.last_name,
        status: newAccount.status,
        isVerified: newAccount.is_verified,
        createdAt: newAccount.created_at,
        updatedAt: newAccount.updated_at,
      };
    } catch (error) {
      this.logger.error(`Error during user registration for ${registerDto.email}`, error instanceof Error ? error.stack : error);
      throw new Error("User registration failed");
    }
  }

  /**
   * ユーザーのログインを行います
   * @param loginDto
   * @returns
   */
  public async login(loginDto: LoginDto): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);

    const account = await this.prisma.account.findUnique({
      where: { email: loginDto.email },
      include: { profile: true }, // 名前を取得するためにプロフィールを含める
    });

    if (!account || !account.profile) {
      this.logger.warn(`Login failed: Account not found or profile missing for email ${loginDto.email}`);
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordMatching = await bcrypt.compare(loginDto.password, account.password_hash);

    if (!isPasswordMatching) {
      this.logger.warn(`Login failed: Invalid password for email ${loginDto.email}`);
      throw new UnauthorizedException("Invalid credentials");
    }

    try {
      await this.prisma.account.update({
        where: { id: account.id },
        data: { last_login_at: new Date() },
      });
    } catch (updateError) {
      this.logger.error(`Failed to update last_login_at for user ${account.id}`, updateError);
      // エラーをログに記録するが、ログインをブロックしない
    }

    const userPayload: User = {
      id: account.id,
      email: account.email,
      firstName: account.profile.first_name,
      lastName: account.profile.last_name,
      status: account.status,
      isVerified: account.is_verified,
      createdAt: account.created_at,
      updatedAt: account.updated_at,
    };

    const tokens = await this.generateTokens(userPayload);

    this.logger.log(`Login successful for email: ${loginDto.email}, User ID: ${account.id}`);
    return {
      user: userPayload,
      ...tokens,
    };
  }

  /**
   * トークンの更新を行います
   * @param refreshTokenDto
   * @returns
   */
  public async refresh(refreshTokenDto: RefreshTokenDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    this.logger.log("Attempting token refresh.");

    try {
      const decoded = await this.jwtService.verifyAsync<JwtRefreshPayload>(refreshTokenDto.refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET_KEY"),
      });

      const account = await this.prisma.account.findUnique({
        where: { id: decoded.sub },
        include: { profile: true },
      });

      if (!account || !account.profile) {
        this.logger.warn(`Refresh failed: User not found for ID ${decoded.sub}`);
        throw new UnauthorizedException("Invalid refresh token");
      }

      const userPayload: User = {
        id: account.id,
        email: account.email,
        firstName: account.profile.first_name,
        lastName: account.profile.last_name,
        status: account.status,
        isVerified: account.is_verified,
        createdAt: account.created_at,
        updatedAt: account.updated_at,
      };

      const tokens = await this.generateTokens(userPayload);
      this.logger.log(`Token refresh successful for User ID: ${account.id}`);
      return tokens;
    } catch (error) {
      this.logger.error("Token refresh failed", error instanceof Error ? error.message : error);
      if (error instanceof Error && error.name === "TokenExpiredError") {
        throw new UnauthorizedException("Refresh token expired");
      }
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  /**
   * ログアウトを行います
   * @param payload
   * @returns
   */
  public async logout(payload: JwtPayload): Promise<void> {
    this.logger.log(`Logout request received for User ID: ${payload.sub}`);
    await this.prisma.account.update({ where: { id: payload.sub }, data: { last_login_at: new Date() } });
    return Promise.resolve();
  }

  /**
   * トークンを生成します
   * @param userPayload
   * @returns
   */
  private async generateTokens(userPayload: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userPayload.id, email: userPayload.email },
        {
          secret: this.configService.get<string>("jwt.secret"),
          expiresIn: this.configService.get<string>("jwt.expiresIn"),
        },
      ),
      this.jwtService.signAsync(
        { sub: userPayload.id },
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
