import { Module } from "@nestjs/common";
import { SecretsController } from "@/src/secrets/secrets.controller";
import { SecretsService } from "@/src/secrets/secrets.service";

@Module({
  controllers: [SecretsController],
  providers: [SecretsService],
  exports: [SecretsService],
})
export class SecretsModule {}
