# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Instagram-powered landing page: posts, media and the hero reel are synced at build time, with automatic token refresh.
- Installable PWA with a web app manifest and an offline-capable service worker.
- Build-time pre-rendering with client hydration.
- Warm workshop redesign: video hero, featured post, Instagram grid, 3-way theme toggle and scroll reveals.
- "About the maker" section with an optimized photo masked as a rounded hexagon.
- Husky pre-push hook that runs lint and tests.

### Changed

- Hosting moved to GitHub Pages; only merged pull requests, the daily schedule and manual runs deploy.
- Rebuilt on Vite, Vitest, oxlint and oxfmt with React 19 and TypeScript 7, replacing Next.js and ESLint.
- Flattened the repo: the web app now lives at the root instead of `apps/web`, and Turborepo is gone.
- `AGENTS.md` is now the main agent guide, and `CLAUDE.md` points to it.

### Removed

- The e-commerce storefront (Convex, Clerk, Stripe, MSW mocks, Expo scaffold, shared UI package). It's preserved on the `ecommerce-archive` branch and the `ecommerce-v0` tag.
- The old Medusa backend under `archive/`, plus unused tool config and docs.
