import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "@/src/auth/auth.module";
import { SecretsController } from "@/src/secrets/secrets.controller";
import { SecretsService } from "@/src/secrets/secrets.service";

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [SecretsController],
  providers: [SecretsService],
  exports: [SecretsService],
})
export class SecretsModule {}
