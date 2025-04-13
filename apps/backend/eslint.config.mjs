import { nestConfig } from "@portfolio-2025/eslint-config/nest";

/** @type {import("eslint").Linter.Config} */
export default [
  ...nestConfig,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.test.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
