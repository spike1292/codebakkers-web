import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// henkbakker.net — personal site + the blog
export default defineConfig({
  site: "https://henkbakker.net",
  integrations: [mdx(), sitemap()],
  prefetch: true,
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },
  vite: { ssr: { noExternal: ["@codebakkers/ui", /^@fontsource/] } },
});
