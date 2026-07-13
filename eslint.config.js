import js from "@eslint/js";
import ts from "typescript-eslint";
import astro from "eslint-plugin-astro";

export default [
  { ignores: ["dist/**", ".astro/**", "node_modules/**", "**/public/pagefind/**"] },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];
