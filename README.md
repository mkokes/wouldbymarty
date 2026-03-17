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
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mkokes/wouldbymarty.git
   cd wouldbymarty
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Copy the example env file
   cp .env.example .env.local
   
   # Edit .env.local with your API keys
   # Required keys are in apps/web/.env.example
   ```

### Running the Development Server

**Web App (recommended for initial setup):**
```bash
cd apps/web
npm run dev
```
Then open http://localhost:3000

**Mobile App:**
```bash
cd apps/mobile
npm run dev
```

**All apps (Turborepo):**
```bash
npm run dev
```

### Development Mode (with Mock Data)

The web app uses MSW (Mock Service Worker) to mock API calls in development mode. This allows you to test the UI without a running Convex backend.

- **Development**: Mock data is served from `apps/web/src/mocks/handlers/`
- **Production**: Calls go to the actual Convex backend

To modify mock data, edit `apps/web/src/mocks/handlers/index.ts`

### Connecting to Convex (Optional)

To connect to a real Convex backend instead of mocks:

1. Set up Convex:
   ```bash
   npx convex dev
   ```

2. Update your environment variables in `apps/web/.env.local` with your Convex deployment URL.

## Environment Variables

The project uses the following environment variables. For development, a `.env.local` file is already configured with mock data support.

```env
# Convex (optional - uses mock data if not set)
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# Clerk Authentication (required for auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWT_ISSUER_DOMAIN=https://your-org.clerk.accounts.dev

# Stripe Payments (optional - for payment testing)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

For development with mock data, you can use the app without configuring Clerk or Convex. The mock MSW handlers will serve data locally.

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
