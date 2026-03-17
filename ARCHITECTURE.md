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

### Action Functions (Complex Operations)

```typescript
stripe.createCheckout()  // Create Stripe checkout session
stripe.handleWebhook()   // Handle Stripe webhooks
paypal.createOrder()    // Create PayPal order
```

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
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  User   │────▶│ Convex  │────▶│ Stripe  │────▶│ Webhook │
│ Checkout│     │ Action  │     │  API    │     │ Handler │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
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
2. Convex action creates Stripe Checkout Session
3. User redirected to Stripe hosted checkout
4. Stripe webhook notifies Convex of payment status
5. Order status updated, user redirected to confirmation

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
│   │       ├── convex.ts  # Convex client
│   │       └── stripe.ts  # Stripe utilities
│   │
│   └── package.json
│
└── mobile/                 # Expo SDK 52+ (Expo Router)
    ├── app/               # File-based routing
    │   ├── _layout.tsx   # Root layout
    │   ├── index.tsx     # Home
    │   ├── products/
    │   │   ├── index.tsx # Listing
    │   │   └── [id].tsx  # Detail
    │   ├── cart.tsx
    │   ├── checkout.tsx
    │   └── orders.tsx
    │
    ├── components/        # UI components
    └── package.json
```

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
├── functions/            # API functions
│   ├── products.ts       # Product queries/mutations
│   ├── carts.ts          # Cart operations
│   ├── orders.ts         # Order management
│   └── stripe.ts         # Payment handling
├── http.ts               # HTTP endpoints (webhooks)
└── convex.config.ts      # Convex configuration
```

## Deployment

### Web (Vercel - Recommended)

1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Mobile (EAS)

1. Run `eas build` for iOS/Android
2. Submit to App Store / Play Store
3. Use EAS Update for OTA updates

### Environment Matrix

| Environment | URL | Description |
|-------------|-----|-------------|
| Development | localhost:3000 | Local dev |
| Preview | *.vercel.app | Pull request previews |
| Production | wouldbymarty.com | Live store |

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
