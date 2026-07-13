import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// codebakkers.com — the blog (canonical home for weekly posts)
export default defineConfig({
  site: "https://codebakkers.com",
  integrations: [sitemap()],
  prefetch: true,
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },
  vite: { ssr: { noExternal: ["@codebakkers/ui"] } },
});
