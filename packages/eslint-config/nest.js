import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginNest from "eslint-plugin-nestjs";
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
  {
    plugins: {
      "@nestjs/eslint-plugin": pluginNest,
    },
    rules: {
      ...pluginNest.configs.recommended.rules,
      // NestJS特有のルール
      "@nestjs/use-dependency-injection": "error",
      "@nestjs/use-validation-pipe": "error",
    },
  },
  {
    extends: ["plugin:@typescript-eslint/recommended", "plugin:@typescript-eslint/recommended-requiring-type-checking"],
    rules: {
      // クラスメソッドやプロパティのアクセス修飾子を必須に
      "@typescript-eslint/explicit-member-accessibility": ["error"],
      // 戻り値の型を明示的に指定することを推奨
      "@typescript-eslint/explicit-function-return-type": ["error"],
    },
  },
  {
    env: {
      node: true,
      jest: true, // テスト用
    },
    parserOptions: {
      project: "tsconfig.json",
      sourceType: "module",
    },
  },
];
