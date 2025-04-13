import baseConfig from "@portfolio-2025/ui/tailwind.config";
import type { Config } from "tailwindcss";

const config = {
  ...baseConfig,
    content: [
    ...baseConfig.content,
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",   
    "../../node_modules/@portfolio-2025/ui/src/**/*.{ts,tsx}" 
  ],
} satisfies Config;

export default config;
