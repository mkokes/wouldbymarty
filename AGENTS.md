# Agent Development Guide

## Project Context
This is a Convex-powered e-commerce project for "WouldByMarty" - a custom woodworking crafts store.

## Architecture
- **Backend**: Convex (server functions + database)
- **Frontend Web**: Next.js 14+ (App Router) in `apps/web/`
- **Frontend Mobile**: Expo SDK 52+ (Expo Router) in `apps/mobile/`
- **Auth**: Clerk
- **Payments**: Stripe + Venmo (via @convex-dev/stripe)
- **Hosting**: Coolify (VPS at dash.martykokes.com)

## Key Files
- `apps/web/` - Next.js web application
- `apps/mobile/` - Expo mobile application
- `convex/` - Convex backend functions and schema

## Coolify Deployment

### Application Settings
- **Build Pack**: Nixpacks
- **Build Command**: `cd apps/web && npm run build`
- **Start Command**: `cd apps/web && npm run start`
- **Port**: 3000
- **Domain**: wouldbymarty.com (add without http/https, enable HTTPS option)

### Environment Variables
Add these in the app's Environment Variables section:

| Variable | Value | Build | Runtime |
|----------|-------|-------|---------|
| `NEXT_CONVEX_DEPLOYMENT` | (from Convex dashboard) | ✅ | ✅ |
| `NEXT_PUBLIC_CONVEX_URL` | (from Convex dashboard) | ✅ | ✅ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | (from Clerk dashboard) | ✅ | ✅ |
| `NEXT_CLERK_SECRET_KEY` | (from Clerk dashboard) | ❌ | ✅ |
| `NEXT_CLERK_JWT_ISSUER_DOMAIN` | (from Clerk dashboard) | ❌ | ✅ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | (from Stripe dashboard) | ✅ | ✅ |
| `NEXT_STRIPE_SECRET_KEY` | (from Stripe dashboard) | ❌ | ✅ |

### CI/CD
- Auto-deploy enabled on push to main branch
- GitHub → Coolify builds → Auto deploy

## Common Commands
```bash
# Web app
cd apps/web
npm run dev      # Development
npm run build    # Production build
npm run start    # Start production server

# Mobile app
cd apps/mobile
npx expo start   # Start development server
eas build        # Build for app stores

# Convex
npx convex dev   # Run Convex development server
```

## Database
- Convex handles all database operations
- Schema defined in `convex/schema.ts`
- Functions in `convex/functions/`

## Payment Configuration
- Stripe: Use test keys during development
- Venmo: Enabled via Stripe Dashboard
