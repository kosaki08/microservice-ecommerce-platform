import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import type { User } from "@/src/auth/types/user";
import { UsersService } from "@/src/users/users.service";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern("users.findById")
  async findById(payload: { id: string }): Promise<User | null> {
    return this.usersService.findById(payload.id);
  }

  @MessagePattern("users.findAll")
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
