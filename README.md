# TripMind Client

AI-powered trip planning frontend built with Next.js App Router.

## Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Backend API running at `http://localhost:5000`

## Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

The app runs at `http://localhost:3000`. The backend API must be running at `http://localhost:5000`.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api/v1` | Backend API base URL |
| `NEXT_PUBLIC_APP_NAME` | `TripMind` | Application name |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Frontend URL |

## Scripts

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
src/
  components/
    auth/          # Auth guard, protected route wrapper
    layout/        # Navbar, footer, page layout
    ui/            # Reusable UI primitives (Button, Input, Card, etc.)
  features/        # Feature modules (empty - ready for business logic)
  hooks/           # Custom hooks (useAuth, useTrips, etc.)
  lib/             # API client, constants, shared utilities
  providers/       # React context providers (TanStack Query)
  services/        # API service layer (auth, trips)
  types/           # TypeScript type definitions
  utils/           # Utility functions

app/
  (public)/        # Public routes: home, login, register
  (protected)/     # Auth-required routes: dashboard
  (admin)/         # Admin-only routes
```

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- TanStack Query
- Axios (with interceptors)
- React Hook Form + Zod
- Recharts, Framer Motion, Lucide React

## Design System

- **Primary**: Deep blue (`#1e40af`)
- **Secondary**: Teal (`#0d9488`)
- **Accent**: Warm amber (`#f59e0b`)
- **Neutral**: Slate scale

## Architecture

- All API calls go through `src/lib/api-client.ts` (Axios instance with auth interceptors)
- Service layer in `src/services/` wraps API endpoints
- Hooks in `src/hooks/` combine TanStack Query with services
- Auth state is query-based (no React context) via `useAuth()` hook
- Protected routes use `<AuthGuard>` component wrapper
