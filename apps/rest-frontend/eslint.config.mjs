import { nextJsConfig } from "@portfolio-2025/eslint-config/next";

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
