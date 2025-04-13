import { Module } from "@nestjs/common";
import { UsersController } from "@/src/users/users.controller";
import { UsersService } from "@/src/users/users.service";
import { PrismaModule } from "@/src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
