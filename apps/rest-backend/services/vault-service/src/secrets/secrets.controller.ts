import type { VaultService, SecretData } from "@/src/secrets/secrets.service";
import { Controller, Get, Post, Param, Body } from "@nestjs/common";

@Controller("secrets")
export class SecretsController {
  constructor(private readonly vaultService: VaultService) {}

  @Post()
  async createSecret(@Body() secretData: { path: string; data: SecretData }) {
    return this.vaultService.writeSecret(secretData.path, secretData.data);
  }

  @Get(":path")
  async getSecret(@Param("path") path: string): Promise<SecretData | null> {
    return this.vaultService.readSecret(path);
  }

  @Post("rotate/:path")
  async rotateSecret(@Param("path") path: string) {
    return this.vaultService.rotateSecret(path);
  }
}
