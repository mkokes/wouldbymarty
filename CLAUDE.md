# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WouldByMarty is an e-commerce storefront for custom woodworking crafts. It's an npm/Turborepo monorepo: a Next.js web app (`apps/web`), a scaffolded-but-not-yet-built Expo mobile app (`apps/mobile`), a shared UI package (`packages/ui`), and a Convex backend (`convex/`) at the repo root. Auth is Clerk, payments are Stripe.

## Commands

Run from the repo root unless noted.

```bash
npm install              # install all workspaces

npm run dev               # turbo: run dev for every app in parallel
npm run build             # turbo: build every app
npm run lint               # turbo: lint every app
npm run clean              # turbo: clean build outputs

# Web app only (fastest path for most frontend work)
cd apps/web
npm run dev                # Next.js dev server on :3000
npm run build
npm run start               # serve production build
npm run lint

# Convex backend
npx convex dev              # start Convex dev deployment, regenerates convex/_generated

# Mobile (scaffold only, see Architecture below)
cd apps/mobile
npx expo start
```

There is no test suite configured anywhere in this repo (no Jest/Vitest/Playwright config, no `test` script in any `package.json`). Don't assume one exists.

## Architecture

### The web app currently runs on mock data, not Convex

This is the most important thing to know before touching `apps/web`. A full Convex backend exists (`convex/schema.ts`, `convex/functions/{products,carts,orders}.ts`, `convex/auth.config.ts` for Clerk JWT validation), and `ConvexClientProvider` (`apps/web/src/app/ConvexClientProvider.tsx`) wraps the app in a `ConvexReactClient`. But no page or component currently calls `useQuery`/`useMutation`/`useAction` against it. Instead:

- Product data is served by MSW (Mock Service Worker) handlers in `apps/web/src/mocks/handlers/index.ts`, which intercept `fetch('/api/products')` in the browser during dev. Pages call this through `apps/web/src/lib/api.ts` (`fetchProducts`, `fetchProductById`), not through Convex queries. There is no real `/api/products` Next.js route — it only resolves because MSW's service worker intercepts it client-side.
- Cart state is persisted to `localStorage` (see `CartDrawer.tsx` and `cart/page.tsx`), not the Convex `carts` table.
- Orders page uses local/mock data, not the Convex `orders` functions.

When wiring a page up to real persistence, the corresponding Convex function usually already exists in `convex/functions/` — reconcile its shape with the mock types in `apps/web/src/lib/api.ts` / `apps/web/src/mocks/handlers/index.ts` rather than assuming they already match.

### Payments are plain Stripe, not `@convex-dev/stripe`

Checkout and webhook handling are implemented as Next.js Route Handlers using the `stripe` npm package directly:
- `apps/web/src/app/api/checkout/route.ts` creates the Checkout Session.
- `apps/web/src/app/api/webhooks/stripe/route.ts` verifies the signature and handles webhook events.

`@convex-dev/stripe` is listed in `apps/web/package.json` but isn't used anywhere yet — that Convex-native integration hasn't been built. Don't assume payment logic lives in `convex/`.

### `packages/ui` is an empty placeholder

It exists as a shared-component target (`src/index.ts`) but currently has no components and isn't imported by `apps/web` or `apps/mobile`. Path aliases for it (`@/ui`) are already configured in `apps/web/tsconfig.json` if this gets built out.

### Environment variable naming is nonstandard

Server-only secrets use a `NEXT_` prefix instead of no prefix (e.g. `NEXT_CLERK_SECRET_KEY`, `NEXT_STRIPE_SECRET_KEY`, `NEXT_CONVEX_DEPLOYMENT`) — this deviates from Next.js's usual convention where only client-exposed vars get a prefix (`NEXT_PUBLIC_*`). Match this existing convention when adding new server env vars rather than "fixing" it in isolation.

### Mobile app is scaffold-only

`apps/mobile` has a `package.json` (Expo SDK 52, Expo Router, Convex, `@clerk/clerk-expo`) but no `app/` directory or screens yet. The approved design for building it out is in `docs/superpowers/specs/2026-04-28-mobile-app-design.md` — read that before starting mobile work rather than re-deriving the screen structure from scratch.

### Deployment

The target deployment platform is Coolify (a VPS at `dash.martykokes.com`), not Vercel, despite older mentions of Vercel elsewhere — build command `cd apps/web && npm run build`, start command `cd apps/web && npm run start`, domain `wouldbymarty.com`, auto-deploy on push to `main`. Per `ROADMAP.md` the Coolify setup itself is still an unchecked task, so don't assume it's live yet. See `AGENTS.md` for the full environment variable matrix.
