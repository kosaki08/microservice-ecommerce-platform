import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import type { LoginDto } from "@/src/auth/dto/login.dto";
import type { RegisterDto } from "@/src/auth/dto/register.dto";
import type { User } from "@/src/auth/types/user";

@Controller()
export class AuthController {
  @MessagePattern("auth.validate")
  public validate(data: LoginDto): User | null {
    // 一時的なモック実装
    if (data.email === "test@example.com" && data.password === "password123") {
      return {
        id: "1",
        email: data.email,
        firstName: "Test",
        lastName: "User",
      };
    }
    return null;
  }

  @MessagePattern("auth.register")
  public register(data: RegisterDto): User {
    // 一時的なモック実装
    return {
      id: "1",
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };
  }

  @MessagePattern("auth.findById")
  public findById(data: { id: string }): User | null {
    // 一時的なモック実装
    if (data.id === "1") {
      return {
        id: "1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      };
    }
    return null;
  }

  @MessagePattern("auth.logout")
  public logout(): void {
    // 一時的なモック実装
    return;
  }
}
