# WouldByMarty - Architecture

## Overview

```
GitLab CI (push to main, or daily schedule)
  └─ prebuild: scripts/fetch-instagram.mjs
       ├─ refresh Instagram token ──▶ PUT back to GitLab CI/CD variable
       ├─ GET graph.instagram.com /me, /me/media
       ├─ download images ──▶ public/instagram/<id>.jpg
       └─ write src/data/instagram.json
  └─ tsc + vite build + prerender (SSR → index.html) ──▶ dist/ ──▶ GitLab Pages ──▶ visitor (hydrates, PWA)
```

The site is fully static. There is no server, database or auth at runtime. The Instagram content is baked in at build time, and a scheduled pipeline keeps it fresh.

## Build-time sync

1. The script reads `INSTAGRAM_ACCESS_TOKEN`. In CI with `GITLAB_API_TOKEN`, it first refreshes the token and saves the new one back to the project variable. Instagram tokens expire after 60 days, so a daily schedule keeps the token alive indefinitely.
2. It fetches the profile and the 12 most recent posts. It uses `media_url` for images and carousel covers, and `thumbnail_url` for videos.
3. It downloads each image into `public/instagram/`. Instagram CDN URLs are signed and expire, so hotlinking them from a static page would break within days.
4. It writes `src/data/instagram.json`, which Vite bundles into the app through `getInstagramFeed()` (`src/lib/instagram.ts`).
5. On any failure it keeps the last good data, or an empty feed, and the build continues. The page then renders the hero and the CTA without the grid.

## Pre-rendering

`scripts/prerender.mjs` runs after the client build. It does an SSR build of `src/entry-server.tsx`, renders `<App>` to a string with the same build-time feed, and injects that string into `dist/index.html`. The page then reaches visitors, crawlers and link unfurlers as full HTML, and React hydrates it in the browser. In the dev server, `#root` is empty and the app renders client-side.

## PWA

- **Manifest:** `public/manifest.webmanifest` (standalone display, theme `#22223B`, any + maskable icons).
- **Service worker:** `public/sw.js`.
  - Pages are network-first, so the newest feed shows when online, and the cached `/` is used offline.
  - Vite's hashed `/assets/*` files are cache-first.
  - Images and icons are stale-while-revalidate, with the runtime cache capped at 60 entries.
- **Registration:** `ServiceWorkerRegister` registers the worker, in production only.

## Why this approach

- **Static plus scheduled rebuilds:** GitLab Pages only serves files. A daily rebuild gives fresh content with no runtime infrastructure to maintain.
- **Self-hosted images:** this avoids broken images when the signed CDN URLs expire, and it lets the service worker cache them same-origin for offline use.
- **The token is persisted in a CI variable:** the only state in the system is one refreshable token, and GitLab already stores it securely.

## History

The previous e-commerce architecture (Convex backend, Clerk, Stripe Route Handlers, MSW mocks, Expo scaffold) is preserved on the `ecommerce-archive` branch. Before that, there was a Medusa attempt, which still lives under `archive/`.
