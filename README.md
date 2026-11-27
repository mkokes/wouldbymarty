# Would? By Marty

Landing page for **Would? By Marty**, a handcrafted woodworking shop. The site is a single page: a hero section, a featured post and grid of the latest posts from the [@wouldbymarty](https://www.instagram.com/wouldbymarty/) Instagram account, a **Tools** section showcasing shop utilities (currently [Segmentor](https://segmentor.wouldbymarty.com/)), an "About the maker" section, and a "Follow on Instagram" call to action. It's an installable PWA, hosted on GitHub Pages.

> The previous e-commerce build (Convex + Clerk + Stripe storefront and an Expo mobile scaffold) is preserved on the `ecommerce-archive` branch and the `ecommerce-v0` tag.

## Tech stack

| Layer   | Technology                                                                  |
| ------- | --------------------------------------------------------------------------- |
| Web     | Vite 8, React 19, TypeScript 7 (static SPA)                                 |
| Content | Instagram API (Unified Login or Instagram Login), fetched **at build time** |
| PWA     | Web app manifest + hand-written service worker (`public/sw.js`)             |
| Hosting | GitHub Pages via GitHub Actions, rebuilt daily on a schedule                |
| Tooling | Vitest, oxlint, oxfmt                                                       |

## Getting started

```bash
npm install
cp .env.example .env.local   # add your Instagram token
npm run dev        # http://localhost:5173 (syncs Instagram first)
npm run build      # pre-rendered static site in dist/
npm run preview    # serve dist/ locally
npm test           # vitest
npm run typecheck  # tsc --noEmit
npm run lint       # oxlint
npm run format     # oxfmt
```

`predev` and `prebuild` run `scripts/fetch-instagram.mjs`. It downloads the profile, the latest posts and the hero reel into `public/instagram/` (as WebP renditions) and writes `src/data/instagram.json`. Both are git-ignored. Without a token the site still builds: the hero video and work grid are hidden, and the page renders the static tagline, tools, and about copy from `src/lib/site.ts`.

A husky pre-push hook runs lint and tests before every `git push`. It's installed automatically by `npm install`.

The production build pre-renders the page into `index.html` (`scripts/prerender.mjs`), so the content is in the HTML for search engines and link previews. The browser then hydrates it.

The service worker only registers in production builds. To test the PWA, run `npm run build && npm run preview`.

## Instagram token setup

`scripts/fetch-instagram.mjs` supports both **Instagram API with Unified Login** (`EAA...` Business Integration System User tokens via `graph.facebook.com`) and **Instagram API with Instagram Login** (`IG...` tokens via `graph.instagram.com`).

### Unified Login (recommended for new Meta apps)

1. **Switch the account to Business or Creator.** In the Instagram app, go to Settings → Account type and tools.
2. **Create a Meta app** at [developers.facebook.com](https://developers.facebook.com/apps) with the Instagram use case (**API setup with Unified login**).
3. **Generate a Business Integration System User token** with `instagram_basic`, set it to never expire, and assign the `@wouldbymarty` Instagram account.

### Instagram Login (legacy)

1. Add the **Instagram** product choosing "API setup with Instagram login" and `instagram_business_basic`.
2. Under _Generate access tokens_, add `@wouldbymarty` and generate an `IG...` token.

## Deploying to GitHub Pages

The workflow is `.github/workflows/deploy.yml`.

- On pull requests, it runs lint, format check, tests and build.
- When a PR is merged into `main`, it deploys `dist/` to GitHub Pages. A direct push to `main` runs the checks but doesn't deploy.
- It also deploys once a day on a schedule (11:00 UTC) to pick up new Instagram posts, and can be started by hand from the Actions tab.

Pages is already enabled for this repo with **Source: GitHub Actions**, and `wouldbymarty.com` is set as the custom domain with HTTPS enforced. The remaining setup is:

- `INSTAGRAM_ACCESS_TOKEN` repository secret: the non-expiring token from above.
- `CLOUDFLARE_API_TOKEN` repository secret + `CLOUDFLARE_ZONE_ID` repository variable _(optional)_: purges the Cloudflare cache after deploy.

GitHub disables scheduled workflows after 60 days without repository activity. If that happens, re-enable the workflow from the Actions tab.

The site assumes it's served from the domain root (Vite's default `base`), which holds for the custom domain.

## Contributing

See [AGENTS.md](AGENTS.md) for the layout and conventions. Work on a branch and open a pull request: the workflow runs lint, format check, tests and build, and a merged PR deploys.

## License

Copyright (C) 2026 Marty Kokes

Licensed under the GNU General Public License v3.0 or later. See [LICENSE](LICENSE).
