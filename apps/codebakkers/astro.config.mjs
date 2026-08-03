import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// codebakkers.com — umbrella hub for CodeBakkers B.V.
export default defineConfig({
  site: "https://codebakkers.com",
  integrations: [sitemap()],
  prefetch: true,
  // Explicit: Astro 7 changes the default to 'jsx', which strips whitespace between
  // inline elements (e.g. "· <a>company details</a> ·"). `true` keeps HTML-aware
  // compression — the v5/v6 behaviour. Currently a no-op; it's a no-surprise upgrade guard.
  compressHTML: true,
  vite: { ssr: { noExternal: ["@codebakkers/ui", /^@fontsource/] } },
});
