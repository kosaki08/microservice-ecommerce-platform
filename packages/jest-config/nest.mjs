import base from "./base.mjs";

/** @type {import('jest').Config} */
const config = {
  ...base,
  rootDir: "src",
  testMatch: ["<rootDir>/**/*.spec.ts"],
  moduleNameMapper: {
    "^@/src/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/../tsconfig.test.json", useESM: true }],
  },
};

export default config;
