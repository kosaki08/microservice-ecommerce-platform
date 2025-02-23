import { Injectable } from "@nestjs/common";
import vault from "node-vault";

export interface SecretData {
  [key: string]: string | number | boolean | object;
}

interface VaultResponse {
  data: {
    data: SecretData;
  };
}

@Injectable()
export class VaultService {
  private client: vault.client;

  constructor() {
    this.client = vault({
      apiVersion: "v1",
      endpoint: process.env.VAULT_ADDR || "http://vault:8200",
      token: process.env.VAULT_TOKEN || "root_token_for_development",
    });
  }

  async writeSecret(path: string, data: SecretData): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.write(`secret/data/${path}`, { data }, (err: Error | null) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  async readSecret(path: string): Promise<SecretData | null> {
    return new Promise((resolve, reject) => {
      this.client.read(`secret/data/${path}`, (err: Error | null, result: VaultResponse) => {
        if (err) reject(err);
        resolve(result?.data?.data || null);
      });
    });
  }

  async rotateSecret(path: string): Promise<void> {
    const newSecret = this.generateNewSecret();
    await this.writeSecret(path, newSecret);
  }

  private generateNewSecret(): SecretData {
    return { key: "new-value" };
  }
}
