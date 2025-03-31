import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, type TestingModule } from "@nestjs/testing";
import type { NetworkError } from "@portfolio-2025/shared";
import { SecretAuthenticationException, SecretConnectionException } from "@/src/secrets/secrets.exception";
import { SecretsService, type SecretData } from "@/src/secrets/secrets.service";

// node-vaultクライアントのモック
const mockVaultClient = {
  write: jest.fn(),
  read: jest.fn(),
};

// vaultモジュールのモック
jest.mock("node-vault", () => {
  return jest.fn().mockImplementation(() => mockVaultClient);
});

describe("SecretsService", () => {
  let service: SecretsService;

  const mockVaultConfig = {
    apiVersion: "v1",
    endpoint: "http://localhost:8200",
    token: "test-token",
    secretMountPoint: "secret",
  };

  beforeAll(() => {
    // エラーケースでのエラーログをモックで抑制する
    jest.spyOn(Logger.prototype, "error").mockImplementation(() => {});
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecretsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              if (key === "vault") return mockVaultConfig;
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<SecretsService>(SecretsService);

    // リクエスト前にモックをリセット
    jest.clearAllMocks();
  });

  afterAll(() => {
    // ログのモックをリセット
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("writeSecret", () => {
    it("should write secret successfully", async () => {
      mockVaultClient.write.mockResolvedValue({ data: { success: true } });

      const path = "test/api-keys";
      const data: SecretData = {
        key1: "value1",
        key2: "value2",
      };

      await service.writeSecret(path, data);

      expect(mockVaultClient.write).toHaveBeenCalledWith(`${mockVaultConfig.secretMountPoint}/data/${path}`, { data });
    });

    it("should handle authentication error", async () => {
      const error: NetworkError = {
        name: "HttpError",
        response: { statusCode: 403 },
        message: "Permission denied",
        code: "FORBIDDEN",
      };
      mockVaultClient.write.mockRejectedValue(error);

      const path = "test/api-keys";
      const data: SecretData = { key: "value" };

      await expect(service.writeSecret(path, data)).rejects.toThrow(SecretAuthenticationException);
    });

    it("should handle connection error", async () => {
      const error: NetworkError = {
        name: "ConnectionError",
        code: "ECONNREFUSED",
        message: "Connection refused",
      };
      mockVaultClient.write.mockRejectedValue(error);

      const path = "test/api-keys";
      const data: SecretData = { key: "value" };

      await expect(service.writeSecret(path, data)).rejects.toThrow(SecretConnectionException);
    });
  });

  describe("readSecret", () => {
    it("should read secret successfully", async () => {
      const mockData = {
        data: {
          data: {
            key1: "value1",
            key2: "value2",
          },
        },
      };
      mockVaultClient.read.mockResolvedValue(mockData);

      const path = "test/api-keys";
      const result = await service.readSecret(path);

      expect(mockVaultClient.read).toHaveBeenCalledWith(`${mockVaultConfig.secretMountPoint}/data/${path}`);
      expect(result).toEqual(mockData.data.data);
    });

    it("should return null for non-existent secret", async () => {
      const error: NetworkError = {
        name: "HttpError",
        response: { statusCode: 404 },
        message: "Secret not found",
        code: "NOT_FOUND",
      };
      mockVaultClient.read.mockRejectedValue(error);

      const path = "test/non-existent";
      const result = await service.readSecret(path);

      expect(result).toBeNull();
    });

    it("should handle server error", async () => {
      const error: NetworkError = {
        name: "HttpError",
        response: { statusCode: 500 },
        message: "Internal server error",
        code: "SERVER_ERROR",
      };
      mockVaultClient.read.mockRejectedValue(error);

      const path = "test/api-keys";

      await expect(service.readSecret(path)).rejects.toThrow(SecretConnectionException);
    });
  });

  describe("rotateSecret", () => {
    it("should rotate secret successfully", async () => {
      // writeSecretのモックを設定
      mockVaultClient.write.mockResolvedValue({ data: { success: true } });

      const path = "test/api-keys";
      await service.rotateSecret(path);

      // writeSecretが1回呼ばれたこと
      expect(mockVaultClient.write).toHaveBeenCalledTimes(1);

      // 新しいシークレットデータが正しい形式であることを確認
      const writeCall = mockVaultClient.write.mock.calls[0] as [string, { data: SecretData }];
      expect(writeCall).toBeDefined();
      expect(writeCall.length).toBe(2);

      const dataPath = writeCall[0];
      const dataObj = (writeCall[1] as { data: SecretData }).data;

      expect(dataPath).toBe(`${mockVaultConfig.secretMountPoint}/data/${path}`);
      expect(dataObj).toHaveProperty("key");
      expect(dataObj).toHaveProperty("generated_at");
      expect(typeof dataObj.key).toBe("string");
      expect(typeof dataObj.generated_at).toBe("string");
    });

    it("should handle error during rotation", async () => {
      const error: NetworkError = {
        name: "HttpError",
        response: { statusCode: 500 },
        message: "Internal server error",
        code: "SERVER_ERROR",
      };
      mockVaultClient.write.mockRejectedValue(error);

      const path = "test/api-keys";

      await expect(service.rotateSecret(path)).rejects.toThrow(SecretConnectionException);
    });
  });
});
