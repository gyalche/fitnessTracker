# Pace Social Architecture

## Platform choice

Use Expo managed workflow for MVP and early production phases.

Reasons:
- fastest path to stable iOS and Android iteration without weakening architecture
- supports the core stack here: React Navigation, Expo Location, Secure Store, Reanimated, NativeWind, maps via config plugin
- keeps the option to move to a custom dev client or bare workflow later if advanced native integrations force it
- lower operational cost while product and tracking requirements are still evolving

Bare React Native would only be the better first choice if smartwatch sync, deep HealthKit/Health Connect integrations, highly customized background services, or unsupported native SDKs were immediate scope.

## Frontend architecture

- `src/app` is intentionally skipped in favor of a clean React Navigation root
- `src/navigation` owns flows, stacks, tabs, and route typing
- `src/features` owns vertical slices
- `src/shared` owns cross-feature UI, data contracts, utilities, and service infrastructure
- `src/providers` owns app-wide providers
- `src/theme` owns visual tokens

## State strategy

- Zustand for client state:
  - auth/session
  - recording session state
  - transient UI state
- TanStack Query for server state:
  - feed pages
  - activity details
  - profile
  - discover data
  - notifications

## Backend recommendation

Primary recommendation: Supabase.

Why:
- managed auth reduces risk and time-to-market
- Postgres handles relational fitness + social data cleanly
- storage handles avatars, route snapshots, exports, and future media
- row-level security maps well to privacy settings
- realtime can support notification and social surfaces
- Edge Functions can handle fanout, challenge jobs, and analytics forwarding

Future scaling path:
- keep repository interfaces stable
- move heavy fanout, segment processing, ranking jobs, and analytics pipelines to Node.js services over time
- optionally add Redis for hot leaderboards, feed caching, and queue-backed jobs

## Navigators

- Root navigator
  - Auth stack
  - App tabs
- Auth stack
  - Welcome
  - Sign In
  - Sign Up
  - Forgot Password
  - Onboarding
- App tabs
  - Feed stack
    - Feed Home
    - Activity Detail
    - User Profile
  - Record
  - Explore stack
    - Explore Home
    - Club Detail
    - Challenge Detail
    - Search
  - Profile stack
    - My Profile
    - Followers
    - Following
    - Settings
    - Privacy
    - Notification Preferences
- Modal routes planned
  - Create Comment
  - Share Activity
  - Report User
  - Block User

## Feature modules

- `auth`
- `feed`
- `activities`
- `recording`
- `profile`
- `social`
- `clubs`
- `challenges`
- `explore`
- `notifications`
- `settings`

## Screen inventory

- Welcome
- Sign In
- Sign Up
- Forgot Password
- Onboarding
- Feed
- Activity Detail
- Record Activity
- Save Activity
- Explore
- Search
- Club Detail
- Challenge Detail
- Leaderboard
- Profile
- Followers
- Following
- Notifications
- Settings
- Privacy Controls
- Notification Preferences
- Blocked Users

## Data models

- User
- Profile
- PrivacySettings
- Activity
- ActivitySplit
- GPSTrackPoint
- Route
- Segment
- Challenge
- Club
- Comment
- Like
- AppNotification
- FollowRelation
- AnalyticsEvent

## Service boundaries

- `AuthRepository`
- `FeedRepository`
- `ProfileRepository`
- `ExploreRepository`
- `NotificationRepository`
- `RecordingRepository` planned for persisted session uploads, track batch writes, and offline sync handoff

## Analytics shape

Event examples:
- `auth_signed_in`
- `onboarding_completed`
- `activity_record_started`
- `activity_record_paused`
- `activity_saved`
- `feed_card_opened`
- `activity_liked`
- `club_joined`
- `challenge_viewed`

Each event should include:
- actor user id
- timestamp
- route, screen, and surface context
- ids for activity, club, challenge, or profile when applicable

## Phase plan

### Phase 1

- app shell
- providers
- navigation
- auth screens
- feed
- profile
- activity detail
- reusable design system
- typed mock repositories

### Phase 2

- location permissions
- live recording session store
- GPS point collection
- route smoothing and map rendering
- save activity flow
- backend adapter swap from mock to real implementation

### Phase 3

- follow graph
- likes/comments mutations
- clubs
- challenges
- notifications
- privacy controls

### Phase 4

- offline recording foundation
- upload queue
- image generation for map snapshots if desired
- testing
- profiling and render optimization
- polish and accessibility audit
