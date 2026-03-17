# WouldByMarty - Build Roadmap

## Project Overview

- **Store**: E-commerce for custom woodworking crafts
- **Platform**: Convex + Next.js + Expo
- **Database**: Convex built-in
- **Payments**: Stripe + Venmo
- **Hosting**: Vercel (web), EAS (mobile)

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
- Payments: Stripe + Venmo (via @convex-dev/stripe)
- Monorepo: Turborepo

---

## Current State

### Completed
- [x] Architecture design finalized
- [x] Documentation updated (README.md, ARCHITECTURE.md)
- [x] Phase 1: Infrastructure Setup
- [x] Phase 2: Backend Functions (products, carts, orders)
- [x] Theme System (4 palettes, light/dark mode, font theming)

### In Progress
- [ ] Phase 3: Web Storefront

### Not Started
- [ ] Phase 4: Mobile App
- [ ] Phase 5: Payments & Deployment

---

## Phase 1: Infrastructure Setup

### 1.1 Project Initialization
- [ ] Create Turborepo monorepo structure
- [ ] Initialize Convex backend (`npx convex dev`)
- [ ] Set up Next.js web app (`apps/web`)
- [ ] Set up Expo mobile app (`apps/mobile`)

### 1.2 Authentication (Clerk)
- [ ] Create Clerk account and application
- [ ] Install `@clerk/nextjs` and `@clerk/expo`
- [ ] Configure Clerk publishable/secret keys
- [ ] Set up JWT template in Clerk dashboard
- [ ] Create `convex/auth.config.ts`

### 1.3 Convex Configuration
- [ ] Set up environment variables
- [ ] Configure Convex provider in Next.js
- [ ] Configure Convex provider in Expo
- [ ] Test authentication flow

### 1.4 Shared Package
- [ ] Create `packages/ui` for shared components
- [ ] Set up build configuration

---

## Phase 2: Backend Functions

### 2.1 Database Schema
- [ ] Define products table
- [ ] Define orders table
- [ ] Define carts table
- [ ] Define users table (linked to Clerk)

### 2.2 Product Functions
- [ ] `products.get()` - List all products
- [ ] `products.getById()` - Get single product
- [ ] `products.getByCategory()` - Filter by category
- [ ] `products.create()` - Create product (admin)
- [ ] `products.update()` - Update product (admin)
- [ ] `products.delete()` - Delete product (admin)

### 2.3 Cart Functions
- [ ] `carts.get()` - Get user's cart
- [ ] `carts.addItem()` - Add item to cart
- [ ] `carts.updateItem()` - Update quantity
- [ ] `carts.removeItem()` - Remove item
- [ ] `carts.clear()` - Empty cart

### 2.4 Order Functions
- [ ] `orders.get()` - Get user's orders
- [ ] `orders.getById()` - Get single order
- [ ] `orders.create()` - Create order from cart
- [ ] `orders.updateStatus()` - Update status (admin)

---

## Phase 3: Web Storefront

### 3.1 Project Setup
- [x] Configure Next.js with Convex
- [x] Set up global styles and theme
- [x] Create layout components
- [x] Theme system (4 palettes, light/dark mode, font theming)

### 3.2 Core Pages
- [ ] `/` - Home page with featured products
- [ ] `/products` - Product catalog with filters
- [ ] `/products/[id]` - Product detail page
- [ ] `/cart` - Shopping cart page
- [ ] `/checkout` - Checkout flow
- [ ] `/orders` - Order history
- [ ] `/account` - User account (via Clerk)

### 3.3 Components
- [ ] `ProductCard` - Product display card
- [ ] `ProductGrid` - Grid layout for products
- [ ] `ProductGallery` - Image gallery with zoom
- [ ] `CartDrawer` - Slide-out cart
- [ ] `CheckoutForm` - Multi-step checkout
- [ ] `OrderSummary` - Order totals display

### 3.4 Woodworking Features
- [ ] Variant selector (wood type, finish)
- [ ] Custom dimensions display
- [ ] Inventory status indicator

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
- [ ] Install `@convex-dev/stripe`
- [ ] Configure Stripe keys in Convex
- [ ] Set up webhook handler
- [ ] Implement checkout session creation
- [ ] Handle payment success/failure

### 5.2 Venmo/PayPal
- [ ] Enable Venmo in Stripe Dashboard
- [ ] Configure PayPal in Stripe
- [ ] Test payment flows

### 5.3 Web Deployment
- [ ] Set up Vercel project
- [ ] Configure environment variables
- [ ] Deploy to production
- [ ] Set up preview deployments

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

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWT_ISSUER_DOMAIN=https://your-org.clerk.accounts.dev

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Production

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_JWT_ISSUER_DOMAIN=https://your-org.clerk.accounts.live

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
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
| Phase 1 Complete | Week 1 | In Progress |
| Phase 2 Complete | Week 2 | Not Started |
| Phase 3 Complete | Week 3 | Not Started |
| Phase 4 Complete | Week 4 | Not Started |
| Phase 5 Complete | Week 5 | Not Started |
| Launch | Week 6 | Not Started |

---

*Last Updated: 2026-03-17*
