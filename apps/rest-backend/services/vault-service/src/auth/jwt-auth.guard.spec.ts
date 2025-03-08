import { UnauthorizedException, type ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import type { Request } from "express";
import { JwtAuthGuard } from "@/src/auth/jwt-auth.guard";

describe("JwtAuthGuard", () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === "JWT_SECRET_KEY") return "test-secret";
              if (key === "jwt.secret") return "test-secret";
              return undefined;
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue("test.jwt.token"),
            verifyAsync: jest.fn().mockResolvedValue({ sub: "1", email: "test@example.com" }),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  function createMockContext(requestPartial: Partial<Request>): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
          ...requestPartial,
        }),
      }),
    } as unknown as ExecutionContext;
  }

  it("有効なトークンで認証通過", async () => {
    const token = "test.jwt.token";
    const mockContext = createMockContext({ headers: { authorization: `Bearer ${token}` } });
    await expect(guard.canActivate(mockContext)).resolves.toBe(true);
  });

  it("無効なトークンで例外発生", async () => {
    jest.spyOn(jwtService, "verifyAsync").mockRejectedValueOnce(new Error("Invalid token"));

    const mockContext = createMockContext({ headers: { authorization: "Bearer invalid" } });
    await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
  });

  it("期限切れトークンの場合に例外を投げる", async () => {
    jest.spyOn(jwtService, "verifyAsync").mockRejectedValue(new TokenExpiredError("jwt expired", new Date()));
    const mockContext = createMockContext({ headers: { authorization: "Bearer expired.jwt.token" } });
    await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
  });

  it("Authorizationヘッダーがない場合に例外を投げる", async () => {
    const mockContext = createMockContext({ headers: {} });
    await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
  });
});
