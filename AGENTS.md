# Agent Development Guide

## Project Context
"WouldByMarty" is a landing page for a custom woodworking shop. The content is pulled from the @wouldbymarty Instagram account at build time. It's a static Vite + React SPA, an installable PWA, hosted on GitLab Pages. See `CLAUDE.md` for the architecture. The former e-commerce build lives on the `ecommerce-archive` branch.

## Key Files
- `apps/web/src/App.tsx`: the landing page
- `apps/web/src/entry-server.tsx`, `apps/web/scripts/prerender.mjs`: build-time pre-rendering
- `.husky/pre-push`: runs lint and tests before a push
- `apps/web/scripts/fetch-instagram.mjs`: the build-time Instagram sync (posts, images, token refresh)
- `apps/web/src/lib/instagram.ts`: reads the synced feed
- `apps/web/public/manifest.webmanifest`, `apps/web/public/sw.js`: the PWA
- `.gitlab-ci.yml`: the GitLab Pages pipeline

## GitLab Pages Deployment

### CI/CD Variables (Settings → CI/CD → Variables)

| Variable | Value | Masked |
|----------|-------|--------|
| `INSTAGRAM_ACCESS_TOKEN` | Long-lived Instagram token (see README) | ✅ |
| `GITLAB_API_TOKEN` | Project access token, Maintainer role, `api` scope | ✅ |

### Pipeline
- Push to the default branch → build → publish to Pages.
- Pipeline schedule (daily) → re-sync Instagram, refresh the token, republish.
- Custom domain: wouldbymarty.com (Deploy → Pages → Domains)

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
