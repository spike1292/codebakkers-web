# codebakkers-web

Monorepo for **codebakkers.com** (the blog) and **henkbakker.net** (personal + company promo),
sharing one design system. Built with Astro, pnpm workspaces + Turborepo, deployed to Cloudflare Pages.

## Structure

```
apps/
  codebakkers/   → codebakkers.com — the blog (canonical home for weekly posts)
  henkbakker/    → henkbakker.net — personal / company promo (no blog)
packages/
  ui/            → @codebakkers/ui — shared brand: tokens, global CSS, components
```

## Requirements

- Node 22+ (`.nvmrc`)
- pnpm 9 (`corepack enable` then `corepack use pnpm@9`)

## Develop

```bash
pnpm install
pnpm dev:codebakkers   # http://localhost:4321
pnpm dev:henkbakker
# or everything: pnpm dev
```

## Build

```bash
pnpm build                       # both, via Turborepo
pnpm --filter codebakkers build  # one site → apps/codebakkers/dist
```

## Deploy — Cloudflare Pages

Create **two** Pages projects from this one repo (Cloudflare Pages supports monorepos):

| Setting | codebakkers.com | henkbakker.net |
|---|---|---|
| Production branch | `main` | `main` |
| Build command | `pnpm --filter codebakkers build` | `pnpm --filter henkbakker build` |
| Build output directory | `apps/codebakkers/dist` | `apps/henkbakker/dist` |
| Root directory | `/` (repo root) | `/` (repo root) |
| Env: `PNPM_VERSION` | `9` | `9` |

Cloudflare installs deps from `pnpm-lock.yaml` and auto-deploys on push to `main`.
Custom domains are added per project in the Pages dashboard.

## DNS — Hostinger → Cloudflare

1. Add each domain as a site in Cloudflare (Cloudflare gives you two nameservers).
2. In Hostinger → Domains → each domain → change nameservers to the Cloudflare pair.
3. Back in Cloudflare, add the custom domain to the matching Pages project (records are created for you).

Registration stays at Hostinger; only DNS moves. codecask.cc is untouched (Squarespace).

## The weekly post (Phase 2 — not built yet)

Each Monday a job drafts a post from that week's Essent commits + memory vault + Jira, runs a
governance filter, and produces:
- a **PR** to this repo adding `apps/codebakkers/src/content/posts/<slug>.md` (personal voice) — you review + merge;
- `weekly/<date>/codecask.md` (company voice) and `weekly/<date>/linkedin.md` — for you to paste.

`PLAN.md` and `weekly/` are gitignored so nothing client-derived lands in this public repo.

## Adding a post manually

Drop a Markdown file in `apps/codebakkers/src/content/posts/`:

```markdown
---
title: "Post title"
description: "One-line summary for listings + RSS."
pubDate: 2026-07-13
tags: ["angular", "edge"]
draft: false
---

Body in Markdown.
```
