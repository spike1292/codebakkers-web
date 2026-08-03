import js from "@eslint/js";
import ts from "typescript-eslint";
import astro from "eslint-plugin-astro";

export default [
  {
    // NB: these must be `**/…` — a bare "dist/**" only matches at the repo root,
    // not apps/*/dist, which is where the generated output actually lives.
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.astro/**",
      "**/.turbo/**",
      "**/public/pagefind/**",
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // Empty catch is deliberate here — storage/clipboard access can throw and we don't care.
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
];
