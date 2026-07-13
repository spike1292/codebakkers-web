import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// codebakkers.com — the blog (canonical home for weekly posts)
export default defineConfig({
  site: "https://codebakkers.com",
  integrations: [sitemap()],
  prefetch: true,
  vite: { ssr: { noExternal: ["@codebakkers/ui"] } },
});
