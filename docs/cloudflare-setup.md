# Cloudflare setup

One-time setup to get **codebakkers.com** and **henkbakker.net** live on Cloudflare Pages,
deployed from GitHub Actions via Wrangler (direct upload).

Order matters: create the Pages projects **before** the first CI deploy — in CI Wrangler can't
prompt to create a missing project, it just fails.

---

## 1. Cloudflare account + zones

Add both domains as zones (needed because we deploy to **apex** domains, not subdomains).

1. Cloudflare dashboard → **Add a site** → `codebakkers.com` → choose the **Free** plan.
2. Repeat for `henkbakker.net`.
3. Cloudflare shows you **two nameservers** per zone (usually the same pair for both).

Keep the tab open — you need those nameservers in step 2.

## 2. Point DNS at Cloudflare (Hostinger)

Registration stays at Hostinger; only DNS moves.

1. [hpanel.hostinger.com](https://hpanel.hostinger.com/domains) → **Domains** → `codebakkers.com`
2. **DNS / Nameservers** → _Change nameservers_ → **Use custom nameservers**
3. Paste the two Cloudflare nameservers → save.
4. Repeat for `henkbakker.net`.

Propagation is usually minutes, but can take up to 24h. Cloudflare emails you when each zone is active.

> If you also still hold **henkbakker.dev**, add it as a zone too — step 6 redirects it.

## 3. Create the two Pages projects

Install/authenticate Wrangler locally (it's already a devDependency):

```bash
pnpm wrangler login
```

Create both projects — names must match the `--project-name` values in `.github/workflows/deploy.yml`:

```bash
pnpm wrangler pages project create codebakkers --production-branch main
pnpm wrangler pages project create henkbakker  --production-branch main
```

Each gets a `*.pages.dev` URL you can test against before DNS is live.

## 4. GitHub secrets

The deploy workflow needs two secrets. Until they're set, CI builds but **skips** deploying
(it logs a notice rather than failing).

**Account ID** — Cloudflare dashboard → any zone → right-hand sidebar → **Account ID**, or:

```bash
pnpm wrangler whoami
```

**API token** — dashboard → **My Profile → API Tokens → Create Token → Create Custom Token**:

| Field      | Value                                 |
| ---------- | ------------------------------------- |
| Permission | **Account · Cloudflare Pages · Edit** |
| Account    | your account                          |
| TTL        | leave default                         |

Then add both to the repo — GitHub → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret name             | Value              |
| ----------------------- | ------------------ |
| `CLOUDFLARE_API_TOKEN`  | the token you made |
| `CLOUDFLARE_ACCOUNT_ID` | your account ID    |

Or from the CLI:

```bash
gh secret set CLOUDFLARE_API_TOKEN
gh secret set CLOUDFLARE_ACCOUNT_ID
```

Push to `main` — both sites should deploy. Check **Actions → Deploy**.

## 5. Attach the custom domains

Per project: Cloudflare dashboard → **Workers & Pages** → select project → **Custom domains** → **Set up a domain**.

| Project       | Domains                                  |
| ------------- | ---------------------------------------- |
| `codebakkers` | `codebakkers.com`, `www.codebakkers.com` |
| `henkbakker`  | `henkbakker.net`, `www.henkbakker.net`   |

Because the zones live in the same account, Cloudflare creates the DNS records itself. HTTPS certs
issue automatically (a few minutes).

## 6. Redirects

`henkbakker.dev` and the old GitHub Pages site should point at `henkbakker.net`.

**henkbakker.dev** — in that zone: **Rules → Redirect Rules → Create rule**

- Name: `dev → net`
- If: _Hostname_ equals `henkbakker.dev` (add a second rule, or an `or`, for `www.henkbakker.dev`)
- Then: **Dynamic** redirect, **301**, expression:
  `concat("https://henkbakker.net", http.request.uri.path)`
- Preserve query string: on

You'll also need a proxied placeholder DNS record (e.g. `A @ 192.0.2.1`, orange cloud on) for the
rule to have something to intercept.

**spike1292.github.io** — that's GitHub's domain, so redirect from the old repo instead: keep a
`CNAME`/meta-refresh there, or simply archive it. Not Cloudflare's concern.

> In-app redirects (old `/posts/*`, `/rss.xml`, `/about`, `/search` on codebakkers.com →
> henkbakker.net) already ship via `apps/codebakkers/public/_redirects` — nothing to configure.

## 7. Web analytics

Cloudflare Web Analytics — cookieless, no consent banner needed. **Each site has its own beacon
token**, injected at build time by CI.

### Get the two tokens

1. Dashboard → **Analytics & Logs → Web Analytics → Add a site**.
2. Add `codebakkers.com`. When it shows the JS snippet, copy just the **token** — the value of
   `data-cf-beacon={"token": "…"}`. You don't need the snippet itself; the site already renders it.
3. Repeat for `henkbakker.net` (a **separate** token).

> Adding the site under Web Analytics is enough — no DNS or page changes required.

### Add them as GitHub secrets

| Secret name                   | Token for       |
| ----------------------------- | --------------- |
| `CF_BEACON_TOKEN_CODEBAKKERS` | codebakkers.com |
| `CF_BEACON_TOKEN_HENKBAKKER`  | henkbakker.net  |

```bash
gh secret set CF_BEACON_TOKEN_CODEBAKKERS
gh secret set CF_BEACON_TOKEN_HENKBAKKER
```

`.github/workflows/deploy.yml` maps each one to `PUBLIC_CF_BEACON_TOKEN` for that app's build via
the matrix, so the right token ends up on the right site.

### How it behaves

- Token set → a single deferred `beacon.min.js` is emitted, with `spa: true` so client-side
  navigations (Astro prefetch) are counted too.
- Token unset → **nothing is rendered**. That's the default for local dev, PR previews and forks,
  so no beacon fires and nothing is collected.
- To test locally, copy `apps/<app>/.env.example` to `.env` and fill in the token.

Data shows up under **Web Analytics** within a few minutes of the first real page view.

---

## Verify

- [ ] Both zones **Active** in Cloudflare
- [ ] `pnpm wrangler pages project list` shows `codebakkers` + `henkbakker`
- [ ] Actions → **Deploy** green, no "skipping deploy" notice
- [ ] https://codebakkers.com and https://henkbakker.net serve over HTTPS
- [ ] `curl -I https://codebakkers.com/rss.xml` → `301` to henkbakker.net
- [ ] `https://henkbakker.net/search` returns results (Pagefind index ships with the build)
- [ ] `curl -s https://henkbakker.net | grep cloudflareinsights` → beacon present (analytics wired)

## Troubleshooting

| Symptom                              | Cause / fix                                                                              |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| `Project not found` in CI            | Step 3 wasn't run, or the name doesn't match `--project-name` in deploy.yml              |
| CI says "skipping deploy"            | `CLOUDFLARE_API_TOKEN` secret missing (step 4)                                           |
| `Authentication error [code: 10000]` | Token lacks **Cloudflare Pages · Edit**, or wrong account ID                             |
| Custom domain stuck "Initializing"   | Zone nameservers not active yet — finish step 2 and wait                                 |
| Old blog URLs 404                    | `_redirects` only applies to the deployed `codebakkers` project; confirm it's in `dist/` |
| No analytics data                    | Beacon secret missing/misnamed, or the site isn't added under Web Analytics (step 7)     |

## Sources

- [Cloudflare Pages — Direct Upload with CI](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/)
- [Cloudflare Pages — Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Onboard a domain to Cloudflare](https://developers.cloudflare.com/fundamentals/manage-domains/add-site/)
- [cloudflare/wrangler-action](https://github.com/cloudflare/wrangler-action)
