import { SecretsService, SecretData } from "@/src/secrets/secrets.service";
import { Controller, Get, Post, Param, Body, UseGuards, NotFoundException } from "@nestjs/common";
import { JwtAuthGuard } from "@/src/auth/jwt-auth.guard";

@Controller("secrets")
@UseGuards(JwtAuthGuard)
export class SecretsController {
  public constructor(private readonly vaultService: SecretsService) {}

  @Post()
  public async createSecret(@Body() secretData: { path: string; data: SecretData }): Promise<void> {
    await this.vaultService.writeSecret(secretData.path, secretData.data);
  }

  @Get(":path")
  public async getSecret(@Param("path") path: string): Promise<SecretData | null> {
    const secret = await this.vaultService.readSecret(path);
    if (!secret) {
      throw new NotFoundException(`Secret not found at path: ${path}`);
    }
    return secret;
  }

  @Post("rotate/:path")
  public async rotateSecret(@Param("path") path: string): Promise<void> {
    await this.vaultService.rotateSecret(path);
  }
}
