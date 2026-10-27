# WouldByMarty - Roadmap

## Direction
For now the site is a static, installable landing page powered by the @wouldbymarty Instagram account and hosted on GitLab Pages. The e-commerce build (Convex, Clerk, Stripe, Expo) is parked on the `ecommerce-archive` branch and the `ecommerce-v0` tag. Its roadmap is preserved there.

## Landing page

### Done
- [x] Archive e-commerce code to `ecommerce-archive`
- [x] Strip shop, auth, payments, Convex, mobile and shared-UI code from `main`
- [x] Build-time Instagram sync with self-hosted images and automatic token refresh
- [x] Hero, Instagram grid, and follow CTA; dark mode follows the OS
- [x] Static build and a GitLab Pages pipeline (`.gitlab-ci.yml`)
- [x] PWA: manifest, icons, offline-capable service worker
- [x] Move from Next.js/ESLint to Vite, Vitest, oxlint and oxfmt; React 19, TypeScript 7
- [x] Build-time pre-rendering with client hydration
- [x] Husky pre-push hook (lint + tests)

### To do
- [ ] Switch the Instagram account to Business/Creator and create the Meta app (see README)
- [ ] Push the repo to GitLab; add the `INSTAGRAM_ACCESS_TOKEN` and `GITLAB_API_TOKEN` CI/CD variables
- [ ] Add a daily pipeline schedule
- [ ] Point wouldbymarty.com at GitLab Pages
- [ ] Optional: Open Graph image
- [ ] Optional: contact/commissions link

## Later
- [ ] Revisit e-commerce: restore from `ecommerce-archive` when ready to sell online (it will need a server host again; GitLab Pages is static-only)

---

*Last Updated: 2026-10-26*
