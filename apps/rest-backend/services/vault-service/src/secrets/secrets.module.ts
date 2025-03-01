import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SecretsController } from "@/src/secrets/secrets.controller";
import { SecretsService } from "@/src/secrets/secrets.service";

@Module({
  imports: [ConfigModule],
  controllers: [SecretsController],
  providers: [SecretsService],
  exports: [SecretsService],
})
export class SecretsModule {}
