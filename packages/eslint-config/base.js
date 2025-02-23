import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  {
    ignores: ["dist/**"],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "error",
      // 未使用の変数をエラーに
      "@typescript-eslint/no-unused-vars": ["error"],
      // any型の使用をエラーに
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
];
