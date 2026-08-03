# Upgrading to Astro 7

We're on **Astro 5.18.2**. Latest is **7.1.6** — a two-major jump (5 → 6 → 7).
`@astrojs/upgrade` handles both hops in one go.

This must be run **on your machine**: it resolves new versions, rewrites `pnpm-lock.yaml`
and needs a real build to verify.

## Run it

```bash
node -v                     # must be >= 22.12.0 (Astro 6 dropped Node 18/20)
git switch -c chore/astro-7

pnpm dlx @astrojs/upgrade    # astro + all official integrations
pnpm install
pnpm build                   # the real test
pnpm check && pnpm lint && pnpm format:check
```

If the toolchain complains, upgrade it too — these must understand the new Rust compiler:

```bash
pnpm up -r @astrojs/check prettier-plugin-astro eslint-plugin-astro typescript
```

## What actually affects this repo

Checked against the [v6](https://docs.astro.build/en/guides/upgrade-to/v6/) and
[v7](https://docs.astro.build/en/guides/upgrade-to/v7/) guides.

### Already handled

| Change                                        | Status                                                                           |
| --------------------------------------------- | -------------------------------------------------------------------------------- |
| **v6:** legacy content collections removed    | ✅ We already use the Content Layer API (`glob()` loader in `content.config.ts`) |
| **v6:** Node 18/20 dropped, needs 22.12+      | ✅ CI and `.nvmrc` are on 22 — confirm your local `node -v`                      |
| **v7:** `compressHTML` default → `'jsx'`      | ✅ Pre-set to `true` in both configs, keeping current whitespace behaviour       |
| **v7:** `src/fetch.ts` now reserved           | ✅ We don't have one                                                             |
| **v7:** `@astrojs/db` removed                 | ✅ Not used                                                                      |
| **v7:** `astro:transitions` internals removed | ✅ Not used                                                                      |
| **v7:** Sätteri replaces remark/rehype        | ✅ We configure no remark/rehype plugins                                         |

### Needs eyes after the upgrade

1. **Rust compiler is stricter about HTML.** Unclosed tags now error; invalid nesting is no
   longer silently corrected. A scan found no block elements inside `<p>`, so we should be
   clean — but the build is the real test.
2. **Code block highlighting.** Markdown now runs through Sätteri, not remark/rehype. Our
   dual-theme `shikiConfig` (`themes: { light, dark }` + `wrap`) drives the blog's code blocks
   and the `--shiki-dark` CSS in `global.css`. **Check a deep-dive post in both themes.**
3. **Whitespace between inline elements.** If we ever drop the `compressHTML: true` guard,
   check the spots where a space carries meaning: `PostLayout` meta (`· updated <time>`),
   the codebakkers footer (`· company details ·`), and `{d.cta} →` on the hub cards.
4. **Vite 7 → 8.** We set `vite.ssr.noExternal` for `@codebakkers/ui` and `@fontsource/*`.
   Confirm fonts and the shared UI package still resolve.
5. **Images.** `sharp` stays an explicit dependency (see the MissingSharp fix) — `<Picture>`
   on both homepages must still emit AVIF/WebP.
6. **CSS cosmetics.** The Rust compiler may re-serialize colors (`rebeccapurple` → `#639`) and
   `url()` quoting. Harmless, but it will show up in the build diff.

## Verify before merging

- [ ] `pnpm build` green for both apps
- [ ] Blog post renders: code blocks highlighted in **both** light and dark
- [ ] `/search` still works (Pagefind index built + mirrored)
- [ ] Fonts load (Fraunces headings, Inter body, JetBrains Mono accents)
- [ ] Homepage portrait renders as AVIF/WebP via `<Picture>`
- [ ] Spacing around `·` separators looks right (meta line, footer)
- [ ] `pnpm check`, `pnpm lint`, `pnpm format:check` clean

## Worth knowing

Astro 7 is a performance release: Rust compiler, Vite 8 + Rolldown, 15–61% faster builds.
There's no feature we currently need from it, so this is maintenance rather than urgent —
it's fine to do on a branch when you have time to eyeball the output.
