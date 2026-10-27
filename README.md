# Would? By Marty

Landing page for **Would? By Marty**, a handcrafted woodworking shop. The site is a single page: a short intro, a grid of the latest posts from the [@wouldbymarty](https://www.instagram.com/wouldbymarty/) Instagram account, and a "Follow on Instagram" call to action. It's an installable PWA, hosted on GitLab Pages.

> The previous e-commerce build (Convex + Clerk + Stripe storefront and an Expo mobile scaffold) is preserved on the `ecommerce-archive` branch and the `ecommerce-v0` tag.

## Tech stack

| Layer | Technology |
|-------|------------|
| Web | Vite 8, React 19, TypeScript 7 (static SPA) |
| Content | Instagram API with Instagram Login, fetched **at build time** |
| PWA | Web app manifest + hand-written service worker (`public/sw.js`) |
| Hosting | GitLab Pages, rebuilt daily by a scheduled pipeline |
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

## Deploying to GitLab Pages

The pipeline is defined in `.gitlab-ci.yml`. It runs on the default branch, installs, builds, and runs lint, format check and tests, builds, and publishes `apps/web/dist` as Pages.

1. **Push the repo to GitLab.** You can make GitLab the primary remote, or mirror it from GitHub.
2. **Add the CI/CD variables** (Settings → CI/CD → Variables, masked, not protected unless `main` is protected):
   - `INSTAGRAM_ACCESS_TOKEN`: the token from above.
   - `GITLAB_API_TOKEN`: a project access token with the Maintainer role and `api` scope. The build uses it to save the refreshed Instagram token back to the variable above, which keeps it from expiring.
3. **Add a pipeline schedule** (Build → Pipeline schedules), e.g. daily at 06:00, targeting `main`. This picks up new posts and refreshes the token.
4. **Custom domain** (Deploy → Pages → Domains): add `wouldbymarty.com`, create the DNS records GitLab shows, and enable automatic HTTPS. The site assumes it's served from the domain root. That's the case for a custom domain or GitLab's "unique domain" setting, but not for a `namespace.gitlab.io/project` subpath.

## License

MIT
