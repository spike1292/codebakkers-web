import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// codebakkers.com — umbrella hub for CodeBakkers B.V.
export default defineConfig({
  site: "https://codebakkers.com",
  integrations: [sitemap()],
  prefetch: true,
  vite: { ssr: { noExternal: ["@codebakkers/ui", /^@fontsource/] } },
});
