# WouldByMarty - E-Commerce Store

## Project Overview

A full-stack e-commerce platform for "WouldByMarty" - a custom woodworking crafts store. Built with a modern, unified architecture using Convex as the universal backend, Next.js for the web storefront, and Expo for the mobile app.

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend (Web)** | Next.js 14+ (App Router) | Web storefront |
| **Frontend (Mobile)** | Expo SDK 52+ (Expo Router) | Native mobile app |
| **Backend** | Convex | Server functions, database, real-time |
| **Authentication** | Clerk | User authentication & management |
| **Payments** | Stripe + Venmo | Payment processing |
| **Monorepo** | Turborepo | Code sharing between web/mobile |
| **Hosting** | Vercel (web), EAS (mobile) | Deployment |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     MONOREPO (Turborepo)                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Web App   │  │ Mobile App  │  │   Shared Code       │ │
│  │  (Next.js)  │  │   (Expo)    │  │ (components/hooks)  │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                            │                                 │
│                   ┌────────▼────────┐                       │
│                   │  Convex Backend  │                       │
│                   │  (Server Funcs)  │                       │
│                   │  + Built-in DB   │                       │
│                   └────────┬────────┘                       │
│                            │                                 │
│         ┌──────────────────┼──────────────────┐             │
│         │                  │                  │             │
│  ┌──────▼──────┐  ┌───────▼───────┐  ┌──────▼──────┐     │
│  │   Stripe    │  │ Clerk Auth    │  │ File Storage│     │
│  │  Payments   │  │               │  │             │     │
│  └─────────────┘  └───────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
wouldbymarty/
├── apps/
│   ├── web/                    # Next.js web application
│   │   ├── src/
│   │   │   ├── app/            # App Router pages
│   │   │   ├── components/     # UI components
│   │   │   └── lib/            # Utilities
│   │   └── package.json
│   │
│   └── mobile/                 # Expo mobile application
│       ├── app/                # Expo Router pages
│       ├── components/         # UI components
│       └── package.json
│
├── packages/
│   └── ui/                    # Shared UI components
│
├── convex/                    # Convex backend
│   ├── schema.ts              # Database schema
│   ├── functions/             # Queries & mutations
│   └── http.ts                # Webhooks
│
├── turbo.json
├── package.json
└── .env.example
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Clerk account (for authentication)
- Stripe account (for payments)
- Convex account (created during setup)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start Convex dev server:
   ```bash
   npx convex dev
   ```
5. Start development servers:
   ```bash
   # Web
   npm run dev --filter=web
   
   # Mobile
   npm run dev --filter=mobile
   ```

## Environment Variables

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_JWT_ISSUER_DOMAIN=

# Stripe Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

## Features

- Product catalog with categories (furniture, decor, kitchen, wall-art, custom)
- Shopping cart with real-time sync
- Checkout with Stripe payments
- Venmo payment option via Stripe
- User authentication (Clerk)
- Order history and tracking
- Real-time inventory updates
- Mobile app with full e-commerce functionality

## Custom Attributes for Woodworking

- **Wood Type**: walnut, oak, maple, cherry, ash, etc.
- **Finish**: matte, glossy, natural oil, lacquer, etc.
- **Dimensions**: L x W x H
- **Weight**

## Development Phases

1. Infrastructure Setup (Convex + Clerk)
2. Database Schema & Backend Functions
3. Web Storefront (Next.js)
4. Mobile App (Expo)
5. Payment Integration (Stripe + Venmo)
6. Deployment

## License

MIT
