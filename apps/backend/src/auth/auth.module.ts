import { Module } from "@nestjs/common";
import { AuthController } from "@/src/auth/auth.controller";

@Module({
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
