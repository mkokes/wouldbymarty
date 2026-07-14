# WouldByMarty - Architecture Documentation

## System Overview

WouldByMarty is a full-stack e-commerce platform built on a unified backend-first architecture. All three platforms (web, mobile, admin) share a single Convex backend, providing real-time data synchronization, type-safe APIs, and automatic scaling.

## Architecture Principles

1. **Single Source of Truth**: Convex database is the authoritative data store for all platforms
2. **Type Safety End-to-End**: TypeScript from database schema to UI components
3. **Real-time by Default**: All data changes propagate instantly to all connected clients
4. **Code Sharing**: Maximum reuse of business logic and UI components across platforms

## Technology Decisions

### Why Convex?

| Aspect | Convex | Medusa (Previous) |
|--------|--------|-------------------|
| Database | Built-in, automatic migrations | Manual PostgreSQL setup |
| API | Type-safe functions | REST endpoints |
| Real-time | Built-in subscriptions | Manual WebSocket |
| Scaling | Automatic | Manual configuration |
| Admin | Build your own | Built-in admin UI |
| Cost | Free tier available | Requires hosting |

### Why Turborepo?

- **Incremental Builds**: Only rebuilds changed packages
- **Remote Caching**: Share build cache across team
- **Parallel Execution**: Maximize CPU utilization
- **Expo SDK 52+**: Native monorepo support

### Why Clerk?

- First-class Convex integration
- Excellent Next.js and Expo support
- Free tier sufficient for small stores
- JWT template for Convex auth

## Data Model

### Schema Overview

```
┌─────────────────┐     ┌─────────────────┐
│    products     │     │     users      │
├─────────────────┤     ├─────────────────┤
│ _id             │     │ _id (clerkId)  │
│ name            │     │ email          │
│ description     │     │ name           │
│ price           │     │ createdAt       │
│ images[]        │     └────────┬────────┘
│ category        │              │
│ inventory       │     ┌────────▼────────┐
│ woodType        │     │     orders      │
│ finish          │     ├─────────────────┤
│ dimensions      │     │ _id             │
│ createdAt       │     │ userId          │
└────────┬────────┘     │ items[]         │
         │               │ status          │
         │               │ total           │
         │               │ shippingAddress │
┌────────▼────────┐     │ paymentId       │
│     carts       │     │ createdAt       │
├─────────────────┤     └─────────────────┘
│ _id             │
│ userId          │
│ items[]         │
│ updatedAt       │
└─────────────────┘
```

### Products Table

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `Id<"products">` | Auto-generated unique ID |
| `name` | `string` | Product name |
| `description` | `string` | Product description |
| `price` | `number` | Price in cents |
| `images` | `string[]` | Array of image URLs |
| `category` | `string` | Category (furniture, decor, kitchen, wall-art, custom) |
| `inventory` | `number` | Stock quantity |
| `woodType` | `string?` | Wood type (walnut, oak, maple, etc.) |
| `finish` | `string?` | Finish type (matte, glossy, oil, etc.) |
| `dimensions` | `string?` | Dimensions string (L x W x H) |
| `createdAt` | `number` | Timestamp |

### Orders Table

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `Id<"orders">` | Auto-generated unique ID |
| `userId` | `string` | Clerk user ID |
| `items` | `OrderItem[]` | Array of order items |
| `status` | `string` | pending, paid, shipped, delivered, cancelled |
| `total` | `number` | Order total in cents |
| `shippingAddress` | `Address` | Shipping address object |
| `paymentId` | `string?` | Stripe payment intent ID |
| `createdAt` | `number` | Timestamp |

### Carts Table

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `Id<"carts">` | Auto-generated unique ID |
| `userId` | `string?` | Clerk user ID (optional for guest carts) |
| `items` | `CartItem[]` | Array of cart items |
| `updatedAt` | `number` | Last update timestamp |

## API Layer

### Query Functions (Read)

```typescript
// Public
products.get()           // List all products
products.getById()       // Get single product
products.getByCategory() // Filter by category

// Authenticated
carts.get()             // Get user's cart
orders.get()            // Get user's orders
orders.getById()        // Get single order
```

### Mutation Functions (Write)

```typescript
// Cart operations
carts.addItem()         // Add item to cart
carts.updateItem()      // Update quantity
carts.removeItem()      // Remove item
carts.clear()          // Empty cart

// Order operations
orders.create()         // Create order from cart
orders.updateStatus()   // Update order status (admin)

// Product operations (admin)
products.create()        // Create product
products.update()        // Update product
products.delete()        // Delete product
```

### Payments (Next.js Route Handlers, not Convex actions)

Payments are **not** implemented as Convex actions today. They're plain Next.js Route Handlers using the `stripe` npm package directly:

```typescript
// apps/web/src/app/api/checkout/route.ts
POST /api/checkout          // Create Stripe checkout session

// apps/web/src/app/api/webhooks/stripe/route.ts
POST /api/webhooks/stripe   // Verify signature and handle Stripe webhook events
```

`@convex-dev/stripe` is listed as a dependency for a future Convex-native integration but isn't used yet. PayPal/Venmo is not implemented.

## Authentication Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│  User   │────▶│ Clerk  │────▶│ Convex  │
│ (UI)    │     │ Auth   │     │ Backend │
└─────────┘     └─────────┘     └─────────┘
     │               │               │
     │  JWT Token    │               │
     │◀──────────────│               │
     │               │  Validate     │
     │               │──────────────▶│
     │               │               │
     │   Authenticated Request        │
     │────────────────────────────────▶
```

1. User signs in via Clerk (web or mobile SDK)
2. Clerk returns JWT token
3. Convex validates token via `auth.config.ts`
4. Authenticated requests include user ID in context

## Payment Flow

```
┌─────────┐     ┌─────────────┐     ┌─────────┐     ┌─────────────┐
│  User   │────▶│ Next.js API │────▶│ Stripe  │────▶│ Next.js API │
│ Checkout│     │ Route       │     │  API    │     │ Webhook     │
└─────────┘     └─────────────┘     └─────────┘     └─────────────┘
     │               │               │               │
     │  Session URL  │               │  Payment      │
     │◀──────────────│               │  Confirmed    │
     │               │               │───────────────▶
     │         Redirect to Stripe Checkout          │
     │─────────────────────────────────────────────▶
     │               │               │               │
     │◀──────────────┼───────────────┼───────────────┤
     │           Success/Cancel Redirect             │
```

1. User clicks "Checkout" in app
2. `apps/web/src/app/api/checkout/route.ts` creates the Stripe Checkout Session
3. User redirected to Stripe hosted checkout
4. Stripe sends webhook events to `apps/web/src/app/api/webhooks/stripe/route.ts`
5. Webhook handler verifies the signature and logs the event (order status is not yet updated in Convex — that wiring hasn't been built)

Note: this flow does not currently go through Convex at all — there's no Convex action or `http.ts` webhook endpoint. See [CLAUDE.md](CLAUDE.md) for what's built vs. wired up.

## File Structure

### Apps

```
apps/
├── web/                    # Next.js 14+ (App Router)
│   ├── src/
│   │   ├── app/           # Pages (page.tsx, layout.tsx)
│   │   │   ├── page.tsx              # Home
│   │   │   ├── products/
│   │   │   │   ├── page.tsx          # Product listing
│   │   │   │   └── [id]/page.tsx    # Product detail
│   │   │   ├── cart/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   └── orders/page.tsx
│   │   │
│   │   ├── components/    # UI components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   └── ...
│   │   │
│   │   └── lib/          # Utilities
│   │       ├── api.ts     # Mock-backed fetch wrapper (products)
│   │       └── themes.ts  # Theme system
│   │
│   └── package.json
│
└── mobile/                 # Expo SDK 52+ (Expo Router) — scaffold only today
    └── package.json        # deps installed (expo-router, convex, @clerk/clerk-expo); no app/ dir or screens yet
```

The tree above is the *planned* structure from `docs/superpowers/specs/2026-04-28-mobile-app-design.md`, not yet built.

### Shared Packages

```
packages/
└── ui/                   # Shared UI components
    ├── Button.tsx
    ├── ProductCard.tsx
    ├── Input.tsx
    └── index.ts
```

### Convex Backend

```
convex/
├── schema.ts             # Database schema
├── auth.config.ts        # Clerk auth configuration
└── functions/            # API functions
    ├── products.ts       # Product queries/mutations
    ├── carts.ts          # Cart operations
    └── orders.ts         # Order management
```

These exist and are schema-complete, but the web app doesn't call them yet (see Current State / [CLAUDE.md](CLAUDE.md)). There is no `http.ts` — payment webhooks are handled in the Next.js app, not Convex.

## Deployment

### Web (Coolify)

Target: Coolify (VPS at dash.martykokes.com), not Vercel — per `ROADMAP.md` the Coolify setup itself is still an unchecked task, so treat this as the plan rather than a confirmed live deployment.

1. Connect GitHub repo to Coolify
2. Nixpacks build pack; build command `cd apps/web && npm run build`, start command `cd apps/web && npm run start`
3. Environment variables set in the Coolify app's Environment Variables section (see `AGENTS.md` for the full list)
4. Auto-deploy on push to `main`

### Mobile (EAS)

1. Run `eas build` for iOS/Android
2. Submit to App Store / Play Store
3. Use EAS Update for OTA updates

### Environment Matrix

| Environment | URL | Description |
|-------------|-----|-------------|
| Development | localhost:3000 | Local dev |
| Production (target) | wouldbymarty.com | Coolify — see note above |

## Security Considerations

1. **Authentication**: All authenticated routes protected via Clerk
2. **Authorization**: Convex functions validate user ownership
3. **Payments**: Stripe handles all payment data (PCI compliant)
4. **Environment**: Secrets stored in environment variables, never committed

## Performance Optimizations

1. **Convex Caching**: Automatic query caching
2. **Image Optimization**: Next.js Image component + CDN
3. **Code Splitting**: Automatic by Next.js/Expo
4. **Bundle Sharing**: Turborepo caches between builds
