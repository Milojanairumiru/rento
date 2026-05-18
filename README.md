# rento

> Your Rental Partner. Rent Smarter.

A peer-to-peer vehicle rental marketplace where vehicle owners can list their vehicles and customers can browse and book them.

## Tech Stack

- **Frontend:** Vite + React + TypeScript + Tailwind CSS v4
- **Backend:** Supabase (Auth + PostgreSQL + Storage)
- **Icons:** Lucide React
- **Notifications:** Sonner

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env` file:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Database Setup

Run `supabase-schema.sql` in your Supabase SQL Editor to create all tables, policies, and triggers.

## Features

- Browse & search vehicles with filters
- Vehicle detail pages with booking flow
- Owner dashboard (manage listings, approve bookings)
- Renter dashboard (view trips)
- Authentication with role selection (owner/renter)
- Image upload to Supabase Storage
- Responsive design

## Deployment

Deployed on Vercel. See `vercel.json` for SPA routing config.
