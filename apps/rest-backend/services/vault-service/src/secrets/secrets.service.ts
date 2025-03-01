import { randomBytes } from "crypto";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import vault from "node-vault";
import type { VaultConfig } from "@/src/config/vault.config";
import {
  SecretAuthenticationException,
  SecretConnectionException,
  SecretNotFoundException,
  SecretServiceException,
} from "@/src/secrets/secrets.exception";

export interface SecretData {
  [key: string]: string | number | boolean | object;
}

interface VaultResponse {
  data: {
    data: SecretData;
  };
}

interface VaultError extends Error {
  response?: {
    statusCode: number;
    body?: unknown;
  };
  code?: string; // ネットワークエラーコード
}

@Injectable()
export class SecretsService {
  private client: vault.client;
  private readonly logger = new Logger(SecretsService.name);
  private readonly config: VaultConfig;

  public constructor(private configService: ConfigService) {
    this.config = this.configService.get<VaultConfig>("vault") as VaultConfig;

    if (!this.config) {
      throw new Error("Vault設定が見つかりません");
    }

    this.client = vault({
      apiVersion: this.config.apiVersion,
      endpoint: this.config.endpoint,
      token: this.config.token ?? process.env.VAULT_TOKEN ?? "",
    });
  }

  private mapVaultError(error: VaultError, path?: string): Error {
    if (error.response) {
      switch (error.response.statusCode) {
        case 401:
        case 403:
          return new SecretAuthenticationException("Unauthorized access", error);
        case 404:
          return new SecretNotFoundException(path ?? "unknown", error);
        case 500:
        case 502:
        case 503:
          return new SecretConnectionException("Secret storage server error", error);
        default:
          return new SecretServiceException(`Unexpected error: ${error.message}`, error);
      }
    }

    if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
      return new SecretConnectionException("Connection failed", error);
    }

    return new SecretServiceException(`Unhandled error: ${error.message}`, error);
  }

  public async writeSecret(path: string, data: SecretData): Promise<void> {
    try {
      await this.client.write(`${this.config.secretMountPoint}/data/${path}`, { data });
      this.logger.log(`Secret written to path: ${path}`);
    } catch (error: unknown) {
      const vaultError = error as VaultError;
      this.logger.error(`Failed to write secret at ${path}: ${vaultError.message}`);
      throw this.mapVaultError(vaultError, path);
    }
  }

  public async readSecret(path: string): Promise<SecretData | null> {
    try {
      const result = (await this.client.read(`${this.config.secretMountPoint}/data/${path}`)) as VaultResponse;
      this.logger.log(`Secret read from path: ${path}`);
      return result?.data?.data || null;
    } catch (error: unknown) {
      const vaultError = error as VaultError;
      this.logger.error(`Failed to read secret at ${path}: ${vaultError.message}`);

      if (vaultError.response?.statusCode === 404) {
        return null; // 404の場合はnullを返却
      }

      throw this.mapVaultError(vaultError, path);
    }
  }

  public async rotateSecret(path: string): Promise<void> {
    try {
      const newSecret = this.generateNewSecret();
      await this.writeSecret(path, newSecret);
      this.logger.log(`Secret rotated at path: ${path}`);
    } catch (error: unknown) {
      const vaultError = error as VaultError;
      this.logger.error(`Failed to rotate secret at ${path}: ${vaultError.message}`);
      throw this.mapVaultError(vaultError, path);
    }
  }

  private generateNewSecret(): SecretData {
    // ランダム文字列を生成
    const bytes = randomBytes(32);
    return {
      key: bytes.toString("base64"),
      generated_at: new Date().toISOString(),
    };
  }
}
