import { JwtAuthGuard } from "@/src/auth/jwt-auth.guard";
import { Post, UseGuards, Request, Body, Controller, ValidationPipe } from "@nestjs/common";
import { AuthService } from "@/src/auth/auth.service";
import { LoginDto } from "@/src/auth/dto/login.dto";
import { RegisterDto } from "@/src/auth/dto/register.dto";
import { RefreshTokenDto } from "@/src/auth/dto/refresh-token.dto";
import type { User } from "@/src/auth/types/user";

interface RequestWithUser extends Request {
  user: User;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("register")
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("refresh")
  async refresh(@Body(ValidationPipe) refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto);
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: RequestWithUser) {
    return this.authService.logout(req.user);
  }
}
