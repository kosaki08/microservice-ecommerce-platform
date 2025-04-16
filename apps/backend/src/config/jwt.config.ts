import { registerAs } from "@nestjs/config";

export default registerAs("jwt", () => ({
  secret: process.env.JWT_SECRET_KEY,
  expiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
  refreshSecret: process.env.JWT_REFRESH_SECRET_KEY,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
}));
