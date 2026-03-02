# Agent Development Guide

## Project Context
This is a Medusa e-commerce project for "WouldByMarty" - a physical products store.

## Architecture
- **Backend**: Medusa v2 running on Node.js
- **Database**: Supabase PostgreSQL
- **Storefront**: Next.js with Medusa React SDK
- **Payments**: Stripe + Venmo

## Key Files
- `backend/` - Medusa backend code
- `storefront/` - Next.js storefront code

## Environment Variables Required
See `.env.example` in each directory.

## Common Commands
```bash
# Backend
cd backend
npm run build
npm run start

# Storefront
cd storefront
npm run build
npm run start
```

## Payment Configuration
- Stripe: Use test keys during development
- Venmo: Requires PayPal developer account setup

## Database
- All database operations go through Supabase
- Use Medusa migrations for schema changes
