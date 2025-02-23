import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginNest from "eslint-plugin-nestjs";
import globals from "globals";
import tseslint from "typescript-eslint";
import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for NestJS applications.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const nestConfig = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      nestjs: pluginNest,
    },
    rules: {
      ...pluginNest.configs.recommended.rules,
      "nestjs/use-dependency-injection": "error",
      "nestjs/use-validation-pipe": "error",
      "@typescript-eslint/explicit-member-accessibility": ["error"],
      "@typescript-eslint/explicit-function-return-type": ["error"],
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        project: ["tsconfig.json", "tsconfig.test.json"],
        sourceType: "module",
      },
    },
  },
];
