# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WouldByMarty is a single-page landing site for a custom woodworking shop. It's populated with posts from the @wouldbymarty Instagram account, and it's an installable PWA hosted on **GitHub Pages**. It's an npm/Turborepo monorepo with one app, a Vite + React 19 + TypeScript 7 SPA in `apps/web`.

The site used to be an e-commerce storefront (Next.js, Convex, Clerk, Stripe, MSW mocks, Expo mobile scaffold, `packages/ui`). All of that was removed from `main`. It's preserved on the `ecommerce-archive` branch and the `ecommerce-v0` tag. Restore from there rather than rebuilding if the shop comes back. `archive/` holds an even older Medusa-based attempt and is not part of the build.

## Commands

From the repo root, these run through Turbo:

```bash
npm install
npm run build          # Instagram sync + tsc + vite build + pre-render -> apps/web/dist
npm test               # vitest
npm run typecheck      # tsc --noEmit (TypeScript 7 / native compiler)
npm run lint           # oxlint
npm run format         # oxfmt (write); format:check to verify
```

Inside `apps/web`:
- `npm run dev` starts the Vite dev server on :5173.
- `npm run preview` serves `dist/`. Use it to test the service worker.
- `npm run test:watch` runs Vitest in watch mode.

A husky `pre-push` hook (`.husky/pre-push`) runs `npm run lint` and `npm test`. `npm install` installs it through the root `prepare` script. The workflow sets `HUSKY=0` and runs lint, format check, tests and build, in that order. Keep all of them green.

## Tooling

- **Vite 8** with `@vitejs/plugin-react`. Vitest is configured in the same `vite.config.ts` (jsdom environment, `src/test/setup.ts` loads jest-dom matchers and RTL cleanup).
- **oxlint** (`.oxlintrc.json`): correctness rules are errors, suspicious rules are warnings. The react, typescript, import, jsx-a11y and vitest plugins are enabled. `react-in-jsx-scope` is off because the project uses the automatic JSX runtime.
- **oxfmt** (`.oxfmtrc.json`): single quotes, 120-column lines. Run `npm run format` rather than hand-formatting.
- Tests sit next to the source as `*.test.ts(x)`. Components take data as props (e.g. `App` receives `feed`), so they can be tested without the generated JSON.

## Architecture

### Static, pre-rendered SPA: there is no server at runtime

GitHub Pages serves the files in `apps/web/dist`. `index.html` holds the meta, Open Graph, manifest and icon tags, plus an `<!--app-html-->` placeholder inside `#root`.

- After `vite build`, `scripts/prerender.mjs` does an SSR build of `src/entry-server.tsx` with Vite's API (into a temporary `dist-ssr/`). It calls `render()` (`renderToString`) and writes the HTML into the placeholder in `dist/index.html`.
- `src/main.tsx` hydrates when `#root` already has markup (production), and otherwise does a client render (the dev server). It also registers the service worker in production.
- Rendering must be deterministic between the build and the browser, or hydration will mismatch. `entry-server.test.tsx` hydrates the server HTML and fails on recoverable errors. The footer year uses `suppressHydrationWarning`, because a build can straddle New Year.

### Instagram data is fetched at build time

- `apps/web/scripts/fetch-instagram.mjs` runs as `predev`/`prebuild`. It loads `.env.local` via `node --env-file-if-exists`.
  - It calls `graph.instagram.com` and downloads each post's image into `public/instagram/<id>.jpg`. Instagram CDN URLs are signed and expire, so the static page must not hotlink them.
  - It writes `src/data/instagram.json`. Both outputs are git-ignored.
  - It never fails the build. On an error it keeps the previous data, or writes an empty feed.
  - In GitHub Actions with `GH_SECRETS_TOKEN` set, it refreshes the 60-day Instagram token, masks it in the logs, and saves it back to the `INSTAGRAM_ACCESS_TOKEN` repository secret with `gh secret set`. The value is passed on stdin. The workflow's `GITHUB_TOKEN` can't write secrets, hence the separate fine-grained PAT.
- `src/lib/instagram.ts` pulls the JSON in through an eager `import.meta.glob`. That resolves to `{}` when the file is missing, so a missing file isn't an error. `normalizeFeed()` fills in the defaults.
- Freshness comes from a scheduled GitHub Actions run (daily), not from runtime fetching.

### PWA

- `public/manifest.webmanifest` holds the manifest, and the icons are in `public/icons/`.
- `public/sw.js` is a hand-written service worker:
  - Navigations are network-first, with an offline fallback to the cached `/`.
  - Vite's hashed `/assets/*` files are cache-first.
  - Other same-origin assets are stale-while-revalidate.
  - Bump `VERSION` when you change caching behaviour.

### Other

- `src/lib/site.ts` holds the handle, profile URL, tagline and fallback bio.
- Styling is plain CSS classes in `src/styles.css`, using CSS custom properties. There's one palette ("Modern Artisan"), and dark mode follows `prefers-color-scheme`.
- Any env var the build needs must be listed in `turbo.json` → `tasks.build.passThroughEnv`, or Turbo will strip it.

### Deployment

`.github/workflows/deploy.yml` runs on pull requests (checks and build only) and on pushes to `main`, a daily schedule and manual dispatch. Those last three also deploy `apps/web/dist` with `actions/deploy-pages`. The `github-pages` environment only allows `main`. The custom domain `wouldbymarty.com` is configured in the repo's Pages settings, not with a CNAME file. See the README for the secrets. The site assumes it's served from the domain root; Vite's `base` is the default `/`.
