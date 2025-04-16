import { Logger, Module } from "@nestjs/common";
import { AuthModule } from "@/src/auth/auth.module";
import { UsersController } from "@/src/users/users.controller";
import { UsersService } from "@/src/users/users.service";

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, Logger],
  exports: [UsersService],
})
export class UsersModule {}
