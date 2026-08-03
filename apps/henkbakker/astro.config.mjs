import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// henkbakker.net — personal + company promo site (no blog)
export default defineConfig({
  site: "https://henkbakker.net",
  integrations: [sitemap()],
  prefetch: true,
  vite: { ssr: { noExternal: ["@codebakkers/ui", /^@fontsource/] } },
});
