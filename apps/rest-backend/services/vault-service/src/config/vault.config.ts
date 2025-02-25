import { registerAs } from "@nestjs/config";

export interface VaultConfig {
  apiVersion: string;
  endpoint: string;
  token?: string;
  secretMountPoint: string;
}

export default registerAs(
  "vault",
  (): VaultConfig => ({
    apiVersion: process.env.VAULT_API_VERSION ?? "v1",
    endpoint: process.env.VAULT_ADDR ?? "http://vault:8200",
    token: process.env.VAULT_TOKEN ?? "root_token_for_development",
    secretMountPoint: process.env.VAULT_SECRET_MOUNT ?? "secret",
  }),
);
