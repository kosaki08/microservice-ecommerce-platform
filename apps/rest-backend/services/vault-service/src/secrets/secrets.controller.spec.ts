import { NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, type TestingModule } from "@nestjs/testing";
import { JwtAuthGuard } from "@/src/auth/jwt-auth.guard";
import { SecretsController } from "@/src/secrets/secrets.controller";
import { SecretsService } from "@/src/secrets/secrets.service";

describe("SecretsController", () => {
  let controller: SecretsController;
  let service: Partial<SecretsService>;

  // モックデータ
  const testSecret = {
    stripe_key: "sk_test_example123",
    stripe_public: "pk_test_example456",
  };

  const rotatedSecret = {
    key: "new-rotated-key",
    generated_at: new Date().toISOString(),
  };

  beforeEach(async () => {
    // SecretsServiceのモックを作成
    const mockSecretsService = {
      writeSecret: jest.fn().mockResolvedValue(undefined),
      readSecret: jest.fn().mockImplementation((path) => {
        if (path === "api-keys") return Promise.resolve(testSecret);
        if (path === "rotated-api-keys") return Promise.resolve(rotatedSecret);
        return Promise.resolve(null);
      }),
      rotateSecret: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecretsController],
      providers: [
        {
          provide: SecretsService,
          useValue: mockSecretsService,
        },
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn().mockResolvedValue({ sub: "1", email: "test@example.com" }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              if (key === "JWT_SECRET_KEY") return "test-secret";
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<SecretsController>(SecretsController);
    service = module.get<SecretsService>(SecretsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("createSecret", () => {
    it("should create a secret", async () => {
      const secretData = {
        path: "api-keys",
        data: testSecret,
      };

      await controller.createSecret(secretData);
      expect(jest.isMockFunction(service.writeSecret)).toBe(true);
      expect(service.writeSecret).toHaveBeenCalledTimes(1);
      expect(service.writeSecret).toHaveBeenCalledWith("api-keys", testSecret);
    });
  });

  describe("getSecret", () => {
    it("should get a secret by path", async () => {
      const result = await controller.getSecret("api-keys");
      expect(result).toEqual(testSecret);
      expect(jest.isMockFunction(service.readSecret)).toBe(true);
      expect(service.readSecret).toHaveBeenCalledTimes(1);
      expect(service.readSecret).toHaveBeenCalledWith("api-keys");
    });

    it("should throw NotFoundException when secret not found", async () => {
      jest.spyOn(service, "readSecret").mockResolvedValueOnce(null);

      await expect(controller.getSecret("non-existent")).rejects.toThrow(NotFoundException);
    });
  });

  describe("getTestApiKeys", () => {
    it("should get api-keys secret", async () => {
      const result = await controller.getTestApiKeys();
      expect(result).toEqual(testSecret);
      expect(jest.isMockFunction(service.readSecret)).toBe(true);
      expect(service.readSecret).toHaveBeenCalledTimes(1);
      expect(service.readSecret).toHaveBeenCalledWith("api-keys");
    });

    it("should throw NotFoundException when api-keys not found", async () => {
      jest.spyOn(service, "readSecret").mockResolvedValueOnce(null);

      await expect(controller.getTestApiKeys()).rejects.toThrow(NotFoundException);
    });
  });

  describe("rotateTestApiKeys", () => {
    it("should rotate api-keys secret", async () => {
      await controller.rotateTestApiKeys();
      expect(jest.isMockFunction(service.rotateSecret)).toBe(true);
      expect(service.rotateSecret).toHaveBeenCalledTimes(1);
      expect(service.rotateSecret).toHaveBeenCalledWith("api-keys");
    });
  });
});
