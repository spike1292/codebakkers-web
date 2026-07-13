# codebakkers-web

Monorepo for **codebakkers.com** (the blog) and **henkbakker.net** (personal + company promo),
sharing one design system. Astro · pnpm workspaces · Turborepo · Cloudflare Pages.

## Structure

```
apps/
  codebakkers/   → codebakkers.com — blog: index, posts, about, company, search, RSS, 404
  henkbakker/    → henkbakker.net — promo: landing, cv, faith, privacy, 404
packages/
  ui/            → @codebakkers/ui — brand tokens, global CSS, fonts, components
                    (Header, Footer, ThemeToggle, BaseHead, Analytics, JsonLd, Prose, …)
```

## Features

- Unified Pine-green brand; **Fraunces + Inter + JetBrains Mono** self-hosted (no external font calls)
- **Light/dark toggle** defaulting to OS, no flash of wrong theme
- Blog: **Shiki** dual-theme code blocks + copy buttons, reading time, TOC on deep-dives,
  related posts, **Pagefind** static search, RSS
- **Cloudflare Web Analytics** (cookieless — set `PUBLIC_CF_BEACON_TOKEN`)
- SEO: JSON-LD (BlogPosting / Person / Organization / Breadcrumb), sitemap, per-site OG images
- WCAG AA: skip links, landmarks, `aria-current`, reduced-motion, focus styles
- Content types: weekly `field-report`, monthly `deep-dive`

## Requirements

- Node 22+ · pnpm 9 (`corepack enable`)

## Develop

```bash
pnpm install
pnpm dev:codebakkers   # http://localhost:4321
pnpm dev:henkbakker
```

> Search only works after a full build (Pagefind indexes `dist/`).

## Build / quality

```bash
pnpm build          # both (codebakkers build also runs `pagefind --site dist`)
pnpm check          # astro check (types)
pnpm lint           # eslint
pnpm format         # prettier --write
```

## Deploy — Wrangler + GitHub Actions

`.github/workflows/deploy.yml` builds each app and runs `wrangler pages deploy` on push to `main`
(and PR previews). Create two Cloudflare Pages projects named **codebakkers** and **henkbakker**,
then add these GitHub repo secrets:

- `CLOUDFLARE_API_TOKEN` (Pages: Edit)
- `CLOUDFLARE_ACCOUNT_ID`

`.github/workflows/ci.yml` runs build + type-check + lint + format on every PR, plus a best-effort
a11y (pa11y-ci) and link-check job.

## DNS & redirects (Hostinger → Cloudflare)

1. Add codebakkers.com and henkbakker.net to Cloudflare; switch nameservers at Hostinger.
2. Attach each domain to its Pages project.
3. Redirects to set up in Cloudflare (Bulk Redirects / Redirect Rules):
   - `henkbakker.dev/*` → `https://henkbakker.net/$1` (301)
   - `spike1292.github.io/*` → `https://henkbakker.net/` (301)
   Old `/blog/*` and `/tags/*` paths on henkbakker.net are handled by `apps/henkbakker/public/_redirects`.

## The weekly post (Phase 2 — not built yet)

Each Monday a job drafts from that week's Essent commits + memory vault + Jira (local CLI),
runs a governance filter, and produces: a **PR** adding `apps/codebakkers/src/content/posts/<slug>.md`
(personal voice; you review + merge), plus `weekly/<date>/codecask.md` and `weekly/<date>/linkedin.md`
(company voice; you paste). Monthly, a longer deep-dive. `PLAN.md` and `weekly/` are gitignored.

## Adding a post

```markdown
---
title: "Post title"
description: "One-line summary for listings + RSS."
pubDate: 2026-07-13
type: field-report        # or: deep-dive
tags: ["angular", "edge"]
draft: false
---

Body in Markdown.
```

Files can be `.md` or `.mdx`. Use `.mdx` when you want to embed components:

```mdx
import Callout from "../../components/Callout.astro";

<Callout type="tip">Interactive bits go here.</Callout>
```
See `apps/codebakkers/src/content/posts/mdx-template.mdx` for a working example.

## Licensing

- **Code** — MIT (`LICENSE`)
- **Content** (posts + page copy) — CC BY-NC 4.0 (`LICENSE-CONTENT.md`)

## Before first deploy

- Drop your real portrait at `apps/henkbakker/public/henk.jpg` (a placeholder is in place).
- Replace the LinkedIn URL in `apps/henkbakker/src/consts.ts`.
- Add the two Cloudflare secrets in GitHub.
- (Optional) set `PUBLIC_CF_BEACON_TOKEN` to enable analytics.
