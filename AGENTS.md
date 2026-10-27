# Agent Development Guide

## Project Context
"WouldByMarty" is a landing page for a custom woodworking shop. The content is pulled from the @wouldbymarty Instagram account at build time. It's a static Vite + React SPA, an installable PWA, hosted on GitHub Pages. See `CLAUDE.md` for the architecture. The former e-commerce build lives on the `ecommerce-archive` branch.

## Key Files
- `apps/web/src/App.tsx`: the landing page
- `apps/web/src/entry-server.tsx`, `apps/web/scripts/prerender.mjs`: build-time pre-rendering
- `.husky/pre-push`: runs lint and tests before a push
- `apps/web/scripts/fetch-instagram.mjs`: the build-time Instagram sync (posts, images, token refresh)
- `apps/web/src/lib/instagram.ts`: reads the synced feed
- `apps/web/public/manifest.webmanifest`, `apps/web/public/sw.js`: the PWA
- `.github/workflows/deploy.yml`: the GitHub Pages workflow

## GitHub Pages Deployment

### Repository secrets (Settings → Secrets and variables → Actions)

| Secret | Value |
|--------|-------|
| `INSTAGRAM_ACCESS_TOKEN` | Long-lived Instagram token (see README) |
| `GH_SECRETS_TOKEN` | Fine-grained PAT for this repo with "Secrets: Read and write" |

### Workflow (`.github/workflows/deploy.yml`)
- Pull request → lint, format check, tests, build (no deploy).
- Push to `main` → the same checks, then deploy to Pages.
- Daily schedule → re-sync Instagram, refresh the token, redeploy.
- Custom domain: wouldbymarty.com, configured in Settings → Pages.

## Common Commands
```bash
npm install
cd apps/web
npm run dev      # Development (syncs Instagram first)
npm run build    # Static build to dist/
npm run preview  # Serve dist/ locally
npm test         # Vitest
npm run lint     # oxlint
npm run format   # oxfmt
```
