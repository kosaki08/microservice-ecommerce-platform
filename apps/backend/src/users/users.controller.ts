import { Controller, NotFoundException, Param, Get, Logger, UseGuards } from "@nestjs/common";
import type { User } from "@portfolio-2025/shared";
import { UsersService } from "@/src/users/users.service";
import { JwtAuthGuard } from "@/src/auth/jwt-auth.guard";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: Logger = new Logger(UsersController.name),
  ) {}

  /**
   * すべてのユーザーを取得
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllRest(): Promise<User[]> {
    this.logger.log("HTTP GET /users requested");
    return this.usersService.findAll();
  }

  /**
   * ID を指定して単一ユーザーを取得
   */
  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async findOneRest(@Param("id") id: string): Promise<User> {
    this.logger.log(`HTTP GET /users/${id} requested`);
    const user = await this.usersService.findById(id);
    if (!user) {
      // ユーザーが見つからない場合は 404 Not Found を返す
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }
}
