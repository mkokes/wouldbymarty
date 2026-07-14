# WouldByMarty - Build Roadmap

## Project Overview

- **Store**: E-commerce for custom woodworking crafts
- **Platform**: Convex + Next.js + Expo + Coolify
- **Database**: Convex built-in
- **Payments**: Stripe + Venmo
- **Hosting**: Coolify (VPS at dash.martykokes.com)

---

## Architecture Migration

### Previous Stack (Medusa)
- Backend: Medusa v2 + Node.js
- Database: Supabase PostgreSQL
- Storefront: Next.js (separate)
- Payments: Stripe + Venmo

### New Stack (Convex)
- Backend: Convex (server functions + database)
- Frontend Web: Next.js 14+ (App Router)
- Frontend Mobile: Expo SDK 52+ (Expo Router)
- Auth: Clerk
- Payments: Stripe, implemented directly via Next.js Route Handlers (not yet migrated to `@convex-dev/stripe`); Venmo not yet configured
- Monorepo: Turborepo

---

## Current State

### Completed
- [x] Architecture design finalized
- [x] Documentation updated (README.md, ARCHITECTURE.md)
- [x] Phase 1: Infrastructure Setup
- [x] Phase 2: Backend Functions (products, carts, orders)
- [x] Phase 3: Web Storefront (all pages and components)
- [x] Theme System (4 palettes, light/dark mode, font theming)
- [x] MSW Mock Data Setup
- [x] Stripe Integration (payment processing + webhook handler)
- [x] Products Listing Page (with category filtering)
- [x] Product Detail Page (with add to cart)
- [x] Cart Page (with Convex persistence)
- [x] Checkout Page (multi-step flow)
- [x] Orders Page (order history)
- [x] Account Page (via Clerk)

### In Progress
- [ ] Phase 4: Mobile App (Expo project initialized, screens pending)
- [ ] Phase 5: Payments - Stripe checkout + webhook logging in place; order-status updates, Venmo, and Convex migration still pending
- [ ] Wire the web app's product/cart/order pages up to live Convex queries (currently mock data + localStorage)

### Not Started
- [ ] Venmo/PayPal Configuration
- [ ] Phase 5: Deployment (Coolify + App Stores)

---

## Phase 1: Infrastructure Setup

### 1.1 Project Initialization
- [x] Create Turborepo monorepo structure
- [x] Initialize Convex backend (`npx convex dev`)
- [x] Set up Next.js web app (`apps/web`)
- [x] Set up Expo mobile app (`apps/mobile`)

### 1.2 Authentication (Clerk)
- [x] Create Clerk account and application
- [x] Install `@clerk/nextjs` and `@clerk/expo`
- [x] Configure Clerk publishable/secret keys
- [x] Set up JWT template in Clerk dashboard
- [x] Create `convex/auth.config.ts`

### 1.3 Convex Configuration
- [x] Set up environment variables
- [x] Configure Convex provider in Next.js
- [x] Configure Convex provider in Expo
- [x] Test authentication flow

### 1.4 Shared Package
- [x] Create `packages/ui` for shared components
- [x] Set up build configuration

---

## Phase 2: Backend Functions

### 2.1 Database Schema
- [x] Define products table
- [x] Define orders table
- [x] Define carts table
- [x] Define users table (linked to Clerk)

### 2.2 Product Functions
- [x] `products.get()` - List all products
- [x] `products.getById()` - Get single product
- [x] `products.getByCategory()` - Filter by category
- [x] `products.create()` - Create product (admin)
- [x] `products.update()` - Update product (admin)
- [x] `products.delete()` - Delete product (admin)

### 2.3 Cart Functions
- [x] `carts.get()` - Get user's cart
- [x] `carts.addItem()` - Add item to cart
- [x] `carts.updateItem()` - Update quantity
- [x] `carts.removeItem()` - Remove item
- [x] `carts.clear()` - Empty cart

### 2.4 Order Functions
- [x] `orders.get()` - Get user's orders
- [x] `orders.getById()` - Get single order
- [x] `orders.create()` - Create order from cart
- [x] `orders.updateStatus()` - Update status (admin)

---

## Phase 3: Web Storefront

### 3.1 Project Setup
- [x] Configure Next.js with Convex
- [x] Set up global styles and theme
- [x] Create layout components
- [x] Theme system (4 palettes, light/dark mode, font theming)

### 3.2 Core Pages
- [x] `/` - Home page with featured products
- [x] `/products` - Product catalog with filters
- [x] `/products/[id]` - Product detail page
- [x] `/cart` - Shopping cart page
- [x] `/checkout` - Checkout flow (multi-step)
- [x] `/orders` - Order history
- [x] `/account` - User account (via Clerk)

### 3.3 Components
- [x] `ProductCard` - Product display card
- [x] `ProductGrid` - Grid layout for products
- [x] `ProductGallery` - Image gallery with zoom
- [x] `CartDrawer` - Slide-out cart
- [x] `CheckoutForm` - Multi-step checkout
- [x] `OrderSummary` - Order totals display

### 3.4 Woodworking Features
- [x] Variant selector (wood type, finish)
- [x] Custom dimensions display
- [x] Inventory status indicator

---

## Phase 4: Mobile App

### 4.1 Project Setup
- [ ] Initialize Expo with Expo Router
- [ ] Configure Convex client
- [ ] Set up navigation

### 4.2 Core Screens
- [ ] Home screen with featured products
- [ ] Products list with filters
- [ ] Product detail screen
- [ ] Cart screen
- [ ] Checkout flow
- [ ] Orders screen
- [ ] Profile screen

### 4.3 Native Features
- [ ] Push notifications for order updates
- [ ] Camera integration for product photos (future)
- [ ] Deep linking

### 4.4 Platform Adaptation
- [ ] Responsive layouts for various screen sizes
- [ ] Native navigation patterns
- [ ] Touch-optimized interactions

---

## Phase 5: Payments & Deployment

### 5.1 Stripe Integration
- [x] Implement checkout session creation (Next.js Route Handler, plain `stripe` SDK)
- [x] Set up webhook handler (verifies signature, logs event)
- [ ] Update order status in Convex from webhook events (currently just logs)
- [ ] Migrate to `@convex-dev/stripe` (currently just a listed dependency, unused)

### 5.2 Venmo/PayPal
- [ ] Enable Venmo in Stripe Dashboard
- [ ] Configure PayPal in Stripe
- [ ] Test payment flows

### 5.3 Web Deployment (Coolify)
- [ ] Connect GitHub repo to Coolify
- [ ] Create Next.js application in Coolify
- [ ] Configure root directory (`apps/web`)
- [ ] Set environment variables
- [ ] Configure domain (wouldbymarty.com)
- [ ] Enable auto-deploy on main branch
- [ ] Set up preview deployments (optional)

### 5.4 Mobile Deployment
- [ ] Set up EAS project
- [ ] Configure build profiles
- [ ] Build iOS app
- [ ] Submit to App Store
- [ ] Build Android app
- [ ] Submit to Play Store

---

## Environment Variables

### Development (.env.local)

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
NEXT_CONVEX_DEPLOYMENT=dev:your-project

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_CLERK_SECRET_KEY=sk_test_...
NEXT_CLERK_JWT_ISSUER_DOMAIN=https://your-org.clerk.accounts.dev

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Production

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
NEXT_CONVEX_DEPLOYMENT=prod:your-project

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
NEXT_CLERK_SECRET_KEY=sk_live_...
NEXT_CLERK_JWT_ISSUER_DOMAIN=https://your-org.clerk.accounts.live

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Database Schema Reference

### Products

```typescript
{
  _id: Id<"products">,
  name: string,
  description: string,
  price: number,        // cents
  images: string[],
  category: string,     // furniture, decor, kitchen, wall-art, custom
  inventory: number,
  woodType?: string,   // walnut, oak, maple, cherry, ash
  finish?: string,     // matte, glossy, natural oil, lacquer
  dimensions?: string,  // "24 x 12 x 8"
  createdAt: number
}
```

### Orders

```typescript
{
  _id: Id<"orders">,
  userId: string,           // Clerk user ID
  items: {
    productId: Id<"products">,
    name: string,
    quantity: number,
    price: number
  }[],
  status: string,           // pending, paid, shipped, delivered, cancelled
  total: number,
  shippingAddress: {
    line1: string,
    line2?: string,
    city: string,
    state: string,
    postal_code: string,
    country: string
  },
  paymentId?: string,
  createdAt: number
}
```

### Carts

```typescript
{
  _id: Id<"carts">,
  userId?: string,          // undefined for guest carts
  sessionId?: string,        // for guest carts
  items: {
    productId: Id<"products">,
    quantity: number
  }[],
  updatedAt: number
}
```

---

## Notes for Development

1. **Convex Functions**: All database operations go through Convex functions in `convex/functions/`
2. **Real-time**: Use `useQuery` hook for real-time updates
3. **Type Safety**: Always import types from `convex/_generated/api`
4. **Authentication**: Use Clerk components and Convex auth hooks
5. **Payments**: Webhooks handled in `convex/http.ts`

---

## Milestones

| Milestone | Target | Status |
|-----------|--------|--------|
| Phase 1 Complete | Week 1 | Complete |
| Phase 2 Complete | Week 2 | Complete |
| Phase 3 Complete | Week 3 | Complete |
| Phase 4 Complete | Week 4 | In Progress |
| Phase 5 Complete | Week 5 | In Progress |
| Launch | Week 6 | Not Started |

---

*Last Updated: 2026-04-28*
