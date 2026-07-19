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

## Features

### Completed

- **Authentication**: Login, register, logout with JWT tokens
- **Landing Page**: Hero, featured destinations, categories, how it works, AI features, stats, testimonials, guides, FAQ, CTA
- **Explore Destinations**: Filterable destination grid with search, categories, seasons, ratings
- **Destination Detail**: Full destination view with gallery, key info, related destinations
- **Trip Management**: Create, edit, view, delete trips with status tracking
- **AI Itinerary Generation**: Generate personalized itineraries via `POST /ai/:tripId/generate`
- **Itinerary Viewing**: Rich itinerary display with day-by-day breakdown, budget, weather, tips
- **Dashboard**: Stats, recent trips, charts, notifications, quick actions
- **Notifications**: Full notification system with filtering, pagination, mark-as-read
- **Billing & Payments**: Stripe integration for subscriptions and credit packs
- **Pricing**: Free, Pro Monthly, and Credits Pack plans
- **Settings**: Notification preferences, account management
- **Profile**: User info, subscription status, trip statistics
- **Admin Panel**: Dashboard with links to add/manage destinations
- **Admin - Add Destination**: Full form with React Hook Form + Zod validation
- **Admin - Manage Destinations**: Responsive table (desktop) / cards (mobile), search, filter, pagination, delete
- **AI Assistant UI**: Conversation sidebar, message area, suggested prompts, trip context selector (preview mode)
- **Blog**: Travel articles page
- **Contact**: Validated form with mailto fallback
- **About**: Project information page
- **Privacy Policy**: Full privacy policy
- **Terms of Service**: Full terms of service

### Backend Dependencies Required

- **AI Assistant Conversational API**: The `/ai-assistant` page requires backend conversational AI endpoints for real-time chat. Currently in preview/simulated mode.
- **Google OAuth**: Google login button exists but is disabled. Backend OAuth routes needed.
- **Saved Destinations**: No backend endpoint for saved/bookmarked destinations. Feature removed from navigation.

## Project Structure

```
src/
  components/
    auth/          # Auth guard, user menu, redirect guard
    destination/   # Destination cards, grid, skeletons
    layout/        # Navbar, footer, page layout
    trip/          # Trip cards, status badges
    ui/            # Reusable UI primitives (Button, Input, Card, Badge, Alert, Modal, Skeleton, Pagination)
  features/
    dashboard/     # Dashboard widgets (stat cards, charts, notifications preview)
    destination-detail/  # Destination detail view, gallery, key info
    explore/       # Explore page with filters
    itinerary/     # Itinerary viewer, generation dialog, credits display
    trips/         # Trip list, detail, form, delete modal
  hooks/           # Custom React hooks (useAuth, useTrips, useDestinations, useAI, etc.)
  lib/             # API client, constants, shared utilities
  providers/       # React Query provider
  services/        # API service layer (auth, trips, destinations, AI, payments, notifications)
  types/           # TypeScript type definitions
  utils/           # Utility functions (cn, redirect sanitization)

app/
  (public)/        # Public routes: home, login, register, explore, pricing, destinations, blog, about, contact, privacy, terms
  (protected)/     # Auth-required routes: dashboard, trips, planner, settings, profile, billing, notifications, ai-assistant
  (admin)/         # Admin-only routes: admin dashboard, items/add, items/manage
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

- **Primary**: Deep blue
- **Secondary**: Teal
- **Accent**: Warm amber
- **Neutral**: Slate scale

## Architecture

- All API calls go through `src/lib/api-client.ts` (Axios instance with auth interceptors)
- Service layer in `src/services/` wraps API endpoints with dual response format handling
- Hooks in `src/hooks/` combine TanStack Query with services
- Auth state is query-based (no React context) via `useAuth()` hook
- Protected routes use `<AuthGuard>` component wrapper
- Forms use React Hook Form with Zod schema validation
- Admin routes are protected by `<AuthGuard requireAdmin>`
