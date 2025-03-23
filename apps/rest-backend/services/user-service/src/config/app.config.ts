import { registerAs } from "@nestjs/config";

export default registerAs("user", () => ({
  service: {
    host: process.env.USER_SERVICE_HOST ?? "0.0.0.0",
    port: parseInt(process.env.USER_SERVICE_PORT ?? "3051", 10),
  },
  http: {
    port: parseInt(process.env.USER_SERVICE_HTTP_PORT ?? "3001", 10),
  },
}));
