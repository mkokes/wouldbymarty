# Would? By Marty

Landing page for **Would? By Marty**, a handcrafted woodworking shop. The site is a single page: a short intro, a grid of the latest posts from the [@wouldbymarty](https://www.instagram.com/wouldbymarty/) Instagram account, and a "Follow on Instagram" call to action. It's an installable PWA, hosted on GitHub Pages.

> The previous e-commerce build (Convex + Clerk + Stripe storefront and an Expo mobile scaffold) is preserved on the `ecommerce-archive` branch and the `ecommerce-v0` tag.

## Tech stack

| Layer | Technology |
|-------|------------|
| Web | Vite 8, React 19, TypeScript 7 (static SPA) |
| Content | Instagram API with Instagram Login, fetched **at build time** |
| PWA | Web app manifest + hand-written service worker (`public/sw.js`) |
| Hosting | GitHub Pages via GitHub Actions, rebuilt daily on a schedule |
| Tooling | Vitest, oxlint, oxfmt |
| Monorepo | Turborepo (single app: `apps/web`) |

## Getting started

```bash
npm install
cp apps/web/.env.example apps/web/.env.local   # add your Instagram token
cd apps/web
npm run dev        # http://localhost:5173 (syncs Instagram first)
npm run build      # pre-rendered static site in apps/web/dist
npm run preview    # serve apps/web/dist locally
npm test           # vitest
npm run lint       # oxlint
npm run format     # oxfmt
```

`predev` and `prebuild` run `scripts/fetch-instagram.mjs`. It downloads the latest 12 posts into `public/instagram/` and writes `src/data/instagram.json`. Both are git-ignored. Without a token the site still builds: the grid is hidden, and the intro uses the fallback copy in `src/lib/site.ts`.

A husky pre-push hook runs lint and tests before every `git push`. It's installed automatically by `npm install`.

The production build pre-renders the page into `index.html` (`scripts/prerender.mjs`), so the content is in the HTML for search engines and link previews. The browser then hydrates it.

The service worker only registers in production builds. To test the PWA, run `npm run build && npm run preview`.

## Instagram token setup

1. **Switch the account to Business or Creator.** In the Instagram app, go to Settings → Account type and tools.
2. **Create a Meta app.** At [developers.facebook.com](https://developers.facebook.com/apps), create an app and add the **Instagram** product, choosing "API setup with Instagram login".
3. **Add the account and generate a token.** Under *Generate access tokens*, add @wouldbymarty (accept the tester invite in Instagram if prompted), then generate a token. The token from this screen is long-lived (60 days).

The app only needs the `instagram_business_basic` permission. It doesn't need app review, because it only reads your own account.

## Deploying to GitHub Pages

The workflow is `.github/workflows/deploy.yml`.
- On pull requests, it runs lint, format check, tests and build.
- On pushes to `main`, it also deploys `apps/web/dist` to GitHub Pages.
- It runs daily on a schedule (11:00 UTC), and can be started by hand from the Actions tab.

Pages is already enabled for this repo with **Source: GitHub Actions**, and `wouldbymarty.com` is set as the custom domain with HTTPS enforced. The remaining setup is two repository secrets (Settings → Secrets and variables → Actions):

1. `INSTAGRAM_ACCESS_TOKEN`: the token from above.
2. `GH_SECRETS_TOKEN`: a [fine-grained personal access token](https://github.com/settings/personal-access-tokens/new) scoped to this repository, with the **Secrets: Read and write** permission. On each scheduled or `main` build, the workflow refreshes the Instagram token and saves it back to `INSTAGRAM_ACCESS_TOKEN` through `gh secret set`, so it never hits the 60-day expiry. Workflows' built-in `GITHUB_TOKEN` can't write secrets, which is why a separate token is needed. Fine-grained tokens expire, so set a long expiry and renew it before then.

GitHub disables scheduled workflows after 60 days without repository activity. If that happens, re-enable the workflow from the Actions tab.

The site assumes it's served from the domain root (Vite's default `base`), which holds for the custom domain.

## License

MIT
