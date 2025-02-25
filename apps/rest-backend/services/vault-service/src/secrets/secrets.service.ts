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

  public constructor() {
    this.client = vault({
      apiVersion: "v1",
      endpoint: process.env.VAULT_ADDR ?? "http://vault:8200",
      token: process.env.VAULT_TOKEN ?? "root_token_for_development",
    });
  }

  public async writeSecret(path: string, data: SecretData): Promise<void> {
    await this.client.write(`secret/data/${path}`, { data });
  }

  public async readSecret(path: string): Promise<SecretData | null> {
    const result = (await this.client.read(`secret/data/${path}`)) as VaultResponse;
    return result?.data?.data || null;
  }

  public async rotateSecret(path: string): Promise<void> {
    const newSecret = this.generateNewSecret();
    await this.writeSecret(path, newSecret);
  }

  private generateNewSecret(): SecretData {
    return { key: "new-value" };
  }
}
