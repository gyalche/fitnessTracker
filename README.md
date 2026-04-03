# Pace Social

Original React Native fitness tracking app architecture inspired by the product category of Strava, without copying branding or exact UI.

## Recommended stack

- Expo managed workflow
- React Navigation
- Zustand
- TanStack Query
- React Hook Form + Zod
- NativeWind for utility styling with tokenized components
- `react-native-maps` for route rendering
- `victory-native` + Skia for performance charts

## Backend direction

Recommended MVP backend: Supabase.

Why:
- mobile auth and session handling are faster to ship safely
- Postgres gives structured relational modeling for activities, social graph, clubs, and challenges
- row-level security fits privacy controls well
- storage can hold route exports, avatars, and richer media later
- Edge Functions can cover notifications, feed fanout helpers, challenge jobs, and analytics forwarding

If scale or deeper event processing outgrows that shape, evolve to a Node.js service layer on top of Postgres/Redis while keeping the frontend repository contracts stable.

## Supabase Setup

1. Copy `.env.example` to `.env` and fill in your project URL and anon key.
2. In the Supabase dashboard, open `SQL Editor` and run [docs/supabase.sql](/Users/dawasherpa/Desktop/fitnessTrack/docs/supabase.sql).
3. In `Authentication` -> `Providers` -> `Email`, disable email confirmation for development or verify emails before sign-in.
4. Start the app:

```bash
npx expo start -c --tunnel
```

If you see missing-table or schema-cache errors, the SQL file has not been applied yet.
