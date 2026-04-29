# Mobile App Design (Phase 4)

**Date:** 2026-04-28
**Status:** Approved by user
**Approach:** Custom Components with Shared Theme (Approach 2)

---

## Overview

Build a complete Expo mobile app for WouldByMarty with all core shopping features:
- Home, Products, Cart, Orders, Account screens
- Hybrid checkout flow (2 steps: Shipping → Payment+Review)
- Custom components optimized for mobile with web app color palette
- Theme system matching web app (4 palettes, light/dark mode)

---

## Architecture

### Tech Stack
- **Framework:** Expo SDK 52+ with Expo Router (file-based routing)
- **Navigation:** Tab-based with stack navigators
- **State:** Convex hooks for real-time data
- **Auth:** Clerk React Native (`@clerk/clerk-expo`)
- **Payments:** Stripe via `@convex-dev/stripe`

### Folder Structure
```
apps/mobile/
├── app/
│   ├── (tabs)/                    # Tab navigator
│   │   ├── _layout.tsx            # Tab configuration
│   │   ├── index.tsx              # Home screen
│   │   ├── products/
│   │   │   ├── _layout.tsx       # Stack navigator for products
│   │   │   ├── index.tsx          # Product list (list view)
│   │   │   └── [id].tsx          # Product detail
│   │   ├── cart.tsx               # Cart screen
│   │   ├── orders/
│   │   │   ├── _layout.tsx       # Stack navigator for orders
│   │   │   ├── index.tsx          # Order history
│   │   │   └── [id].tsx          # Order detail
│   │   └── account.tsx            # User account
│   ├── checkout/
│   │   └── index.tsx              # Checkout flow (2-step hybrid)
│   ├── _layout.tsx                # Root layout (providers)
│   └── +not-found.tsx             # 404 page
├── components/                     # Reusable components
│   ├── ThemeProvider.tsx          # Theme context (matches web)
│   ├── ConvexClientProvider.tsx    # Convex setup
│   ├── ProductCard.tsx            # List view product card
│   ├── ProductGallery.tsx         # Image gallery with zoom
│   ├── CartItem.tsx               # Cart item row
│   ├── CheckoutForm.tsx           # 2-step checkout
│   └── ...
├── theme/                          # Theme configuration
│   ├── colors.ts                  # Color palettes (from web)
│   ├── fonts.ts                   # Font config (Chango, Montserrat)
│   └── index.ts                   # Theme provider setup
└── package.json
```

---

## Navigation Design

### Tab Structure (5 tabs)
1. **Home** (`/`) - Featured products, hero section
2. **Products** (`/products`) - Product catalog with filters
3. **Cart** (`/cart`) - Shopping cart with quantity controls
4. **Orders** (`/orders`) - Order history
5. **Account** (`/account`) - User profile, settings

### Stack Navigators
- **Products:** List → Detail (`/products/[id]`)
- **Orders:** History → Detail (`/orders/[id]`)
- **Checkout:** Separate stack (modal style, not in tabs)

---

## Screen Designs

### 1. Home Screen (`app/(tabs)/index.tsx`)
- Hero section with "Would? By Marty" branding
- Featured products section (horizontal scroll)
- Categories quick links
- Pull-to-refresh

### 2. Products Screen (`app/(tabs)/products/index.tsx`)
- **Layout:** List view (user preference)
- Category filter tabs (horizontal scroll)
- Search bar at top
- Each product shows: image, name, price, wood type
- Tap to navigate to detail

### 3. Product Detail Screen (`app/(tabs)/products/[id].tsx`)
- Image gallery (swipeable)
- Product name, price, description
- Variant selector (wood type, finish)
- Quantity selector
- "Add to Cart" button
- Inventory status indicator

### 4. Cart Screen (`app/(tabs)/cart.tsx`)
- List of cart items with image, name, quantity
- Swipe to delete
- Quantity controls (+/- buttons)
- Order summary (subtotal, tax, total)
- "Proceed to Checkout" button

### 5. Checkout Flow (`app/checkout/index.tsx`)
**Hybrid 2-step approach:**

**Step 1: Shipping Information**
- Full name
- Address (line 1, line 2 optional)
- City, State, ZIP
- Country picker
- "Continue to Payment" button

**Step 2: Payment + Review**
- Order summary (collapsible)
- Card information (Stripe elements)
- Billing address toggle
- "Place Order" button
- Progress indicator (2 dots)

### 6. Orders Screen (`app/(tabs)/orders/index.tsx`)
- List of past orders
- Each order shows: order #, date, total, status
- Status badges (pending, paid, shipped, delivered)
- Tap to view order detail

### 7. Order Detail Screen (`app/(tabs)/orders/[id].tsx`)
- Order items list
- Shipping address
- Order status timeline
- Total breakdown

### 8. Account Screen (`app/(tabs)/account.tsx`)
- User info (name, email from Clerk)
- Order history link
- Theme selector (matching web)
- Sign out button
- App version info

---

## Theme System

### Colors (Matching Web App)
Copy color palettes from web app's theme system:
- 4 color palettes (same as web)
- Light/dark mode support
- CSS variables → React Native theme values

### Typography
- **Headings:** Chango (same as web)
- **Body:** Montserrat (same as web)
- Sizes optimized for mobile (smaller than web)

### Implementation
```typescript
// theme/colors.ts - matches web app palettes
export const palettes = {
  default: { primary: '#...', secondary: '#...', ... },
  warm: { ... },
  cool: { ... },
  forest: { ... },
};

// theme/index.tsx - ThemeProvider
export function ThemeProvider({ children }) {
  // Same logic as web app
  // Provide theme context with colors, fonts, mode
}
```

---

## Data Flow

### Convex Integration
- Use `useQuery` for real-time data fetching
- Use `useMutation` for cart/order actions
- Match web app's Convex functions (reuse backend)

### Key Queries
- `api.products.get` - List products
- `api.products.getById` - Single product
- `api.carts.get` - Get user cart
- `api.orders.get` - Get user orders

### Authentication
- Clerk React Native for login/signup
- Token stored securely (Clerk handles this)
- Convex client configured with Clerk session token

---

## Components List

### Shared Components (to build)
1. **ProductCard** - List view variant (image left, details right)
2. **ProductGallery** - Swipeable image gallery
3. **CartItem** - Cart row with quantity controls
4. **OrderCard** - Order summary card
5. **CheckoutForm** - 2-step hybrid checkout
6. **ThemeSelector** - Mobile-optimized theme picker
7. **CategoryFilter** - Horizontal scrolling filter tabs
8. **LoadingSpinner** - Branded loading indicator
9. **EmptyState** - No products/cart/orders message
10. **ErrorBoundary** - Error handling wrapper

---

## Key Features

### Optimized for Mobile
- Touch-friendly tap targets (min 44x44px)
- Swipe gestures (delete cart item, navigate images)
- Pull-to-refresh on list screens
- Native feel inputs and buttons
- Safe area handling (notch, home indicator)

### Matching Web App
- Same color palette and fonts
- Same Convex backend functions
- Same checkout flow logic
- Consistent branding

---

## Success Criteria

- [ ] All 8 screens implemented and functional
- [ ] Tab navigation working smoothly
- [ ] Product browsing (list view) works
- [ ] Cart management (add, update, remove) works
- [ ] Hybrid checkout flow completes orders
- [ ] Order history displays correctly
- [ ] Theme switching works (4 palettes + light/dark)
- [ ] Authentication (login/signup) works
- [ ] Matches web app color palette
- [ ] Expo build succeeds for iOS/Android

---

## Next Steps

After design approval:
1. Invoke `writing-plans` skill to create implementation plan
2. Execute plan with subagent-driven development
3. Test on iOS simulator and Android emulator
4. Prepare for EAS build (Phase 5.4)
