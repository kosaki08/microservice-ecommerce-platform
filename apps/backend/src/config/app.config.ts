import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  http: {
    port: parseInt(process.env.APP_HTTP_PORT ?? "8080", 10),
  },
}));
