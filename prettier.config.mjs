/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */
/** @type {import('prettier').Config & SortImportsConfig} */
const config = {
  plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  tailwindConfig: "./packages/ui/tailwind.config.ts",
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "^(nest/(.*)$)|^(nestjs/(.*)$)|^(nest$)|^(nestjs$)",
    "<THIRD_PARTY_MODULES>",
    "^@/",
    "^types$",
    "^[../]",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators"],
  printWidth: 140,
  importOrderTypeScriptVersion: "5.4.2",
};

export default config;
