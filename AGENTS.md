# AGENTS.md

Public monorepo for **codebakkers.com** (personal site, blog, company page) and **henkbakker.net**
(redirect only). Astro, pnpm workspaces, Turborepo, Cloudflare Pages. Overview: [`README.md`](README.md).

## Layout

- `apps/codebakkers/`: the site. Pages in `src/pages/`, posts in `src/content/posts/`
  (schema in `src/content.config.ts`), site constants in `src/consts.ts`.
- `apps/henkbakker/`: only a `_redirects` file. No build.
- `packages/ui/`: `@codebakkers/ui`, the shared brand tokens, global CSS, fonts and components.
- `docs/`: runbooks. Read the one that matches the task:
  - copy, CV page or post text: [`docs/tone-of-voice.md`](docs/tone-of-voice.md)
  - deploy, DNS, secrets: [`docs/cloudflare-setup.md`](docs/cloudflare-setup.md)
  - Astro version bump: [`docs/astro-7-upgrade.md`](docs/astro-7-upgrade.md)

## Commands

Run from the repo root. pnpm 9 (`packageManager`), Node from `.nvmrc`.

```bash
pnpm install --frozen-lockfile
pnpm dev:codebakkers   # http://localhost:4321
pnpm build             # turbo; codebakkers also runs pagefind
pnpm preview
pnpm check             # astro check (types)
pnpm lint              # eslint
pnpm format:check      # prettier; pnpm format writes
```

There is no test suite. CI (`.github/workflows/ci.yml`) gates on `check`, `lint`, `format:check`
and `build`, in that order. Its `quality` job (linkinator, pa11y-ci) is best effort.

## Deploy

`.github/workflows/deploy.yml` deploys both apps to Cloudflare Pages with Wrangler: production on
push to `main`, a preview per PR branch. Without the Cloudflare secrets it builds and skips the deploy.

## Traps

- The repo is public. Commit only facts that already appear on the live site. `PLAN.md`,
  `weekly/` and `private/` are gitignored and stay that way.
- Commits follow Conventional Commits; a husky hook runs commitlint and lint-staged (prettier).
- `pnpm format` rewrites every file prettier sees, untracked files too. Format only what you changed.
- Site search works only after `pnpm build`: Pagefind indexes `dist/` and the build copies it to
  `apps/codebakkers/public/pagefind/` (gitignored).
- Images go in `apps/*/src/assets/` so Astro optimizes them. Files in `public/` ship as they are.
- Old URLs are redirected in `apps/codebakkers/public/_redirects`. Update it when you move a page.
- Node versions disagree: `.nvmrc` and `engines` say 24, CI runs 22, the README says 22+.
