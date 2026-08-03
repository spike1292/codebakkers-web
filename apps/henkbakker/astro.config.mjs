import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// henkbakker.net — personal site + the blog
export default defineConfig({
  site: "https://henkbakker.net",
  integrations: [mdx(), sitemap()],
  prefetch: true,
  // Explicit: Astro 7 changes the default to 'jsx', which strips whitespace between
  // inline elements (e.g. "· <a>company details</a> ·"). `true` keeps HTML-aware
  // compression — the v5/v6 behaviour. Currently a no-op; it's a no-surprise upgrade guard.
  compressHTML: true,
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },
  vite: { ssr: { noExternal: ["@codebakkers/ui", /^@fontsource/] } },
});
