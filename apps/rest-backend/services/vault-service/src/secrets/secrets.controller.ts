import type { VaultService, SecretData } from "@/src/secrets/secrets.service";
import { Controller, Get, Post, Param, Body } from "@nestjs/common";

@Controller("secrets")
export class SecretsController {
  public constructor(private readonly vaultService: VaultService) {}

  @Post()
  public async createSecret(@Body() secretData: { path: string; data: SecretData }): Promise<void> {
    await this.vaultService.writeSecret(secretData.path, secretData.data);
  }

  @Get(":path")
  public async getSecret(@Param("path") path: string): Promise<SecretData | null> {
    return this.vaultService.readSecret(path);
  }

  @Post("rotate/:path")
  public async rotateSecret(@Param("path") path: string): Promise<void> {
    await this.vaultService.rotateSecret(path);
  }
}
