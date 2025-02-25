import { HttpException, HttpStatus } from "@nestjs/common";

export class SecretServiceException extends HttpException {
  public constructor(message: string, cause?: Error) {
    const isDev = process.env.NODE_ENV !== "production";

    super(
      {
        message,
        error: "Secret Service Error",
        cause: cause?.message,
        // 本番環境ではスタックトレースを含めない
        ...(isDev && { stack: cause?.stack }),
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    this.name = "SecretServiceException";
    if (cause?.stack && isDev) {
      this.stack = cause.stack;
    }
  }
}

export class SecretConnectionException extends SecretServiceException {
  public constructor(message: string, cause?: Error) {
    super(`Secret storage connection failed: ${message}`, cause);
    this.name = "SecretConnectionException";
  }
}

export class SecretAuthenticationException extends SecretServiceException {
  public constructor(message: string, cause?: Error) {
    super(`Secret storage authentication failed: ${message}`, cause);
    this.name = "SecretAuthenticationException";
  }
}

export class SecretNotFoundException extends SecretServiceException {
  public constructor(path: string, cause?: Error) {
    super(`Secret not found at path: ${path}`, cause);
    this.name = "SecretNotFoundException";
  }
}
