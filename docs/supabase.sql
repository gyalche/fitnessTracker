-- Pace Social Supabase schema
-- Run this in the Supabase SQL editor.
-- For immediate app sign-up/sign-in flows, disable email confirmation in Auth settings
-- or verify the email before attempting first sign-in.

create extension if not exists pgcrypto;

grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to authenticated, service_role;
grant all on all sequences in schema public to authenticated, service_role;
alter default privileges in schema public grant all on tables to authenticated, service_role;
alter default privileges in schema public grant all on sequences to authenticated, service_role;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text not null,
  handle text not null unique,
  bio text,
  avatar_url text,
  city text,
  preferred_sports text[] not null default '{}',
  weekly_goal_minutes integer,
  followers_count integer not null default 0,
  following_count integer not null default 0,
  club_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.privacy_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  profile_visibility text not null default 'public' check (profile_visibility in ('public', 'followers', 'private')),
  activity_visibility text not null default 'followers' check (activity_visibility in ('public', 'followers', 'private')),
  map_visibility text not null default 'start_end_hidden' check (map_visibility in ('full', 'start_end_hidden', 'private')),
  allow_tagging boolean not null default true,
  allow_club_invites boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('run', 'ride', 'walk')),
  title text not null,
  description text,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  moving_time_seconds integer not null,
  elapsed_time_seconds integer not null,
  distance_meters integer not null,
  average_pace_seconds_per_km integer,
  average_speed_kph numeric(6,2),
  elevation_gain_meters integer not null default 0,
  calories integer,
  route jsonb not null default '[]'::jsonb,
  splits jsonb not null default '[]'::jsonb,
  visibility text not null default 'followers' check (visibility in ('public', 'followers', 'private')),
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (activity_id, user_id)
);

create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  cover_image_url text,
  member_count integer not null default 0,
  city text,
  sport_types text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  sport_types text[] not null default '{}',
  target_distance_meters integer,
  target_activity_count integer,
  start_date date not null,
  end_date date not null,
  participant_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('like', 'comment', 'follow', 'challenge_progress', 'club_invite')),
  actor_user_id uuid references auth.users(id) on delete set null,
  activity_id uuid references public.activities(id) on delete set null,
  message text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_user_id on public.profiles (user_id);
create index if not exists idx_activities_user_started on public.activities (user_id, started_at desc);
create index if not exists idx_activities_started_at on public.activities (started_at desc);
create index if not exists idx_comments_activity_id on public.comments (activity_id, created_at asc);
create index if not exists idx_likes_activity_id on public.likes (activity_id);
create index if not exists idx_notifications_user_id on public.notifications (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.privacy_settings enable row level security;
alter table public.activities enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.notifications enable row level security;
alter table public.clubs enable row level security;
alter table public.challenges enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_display_name text;
  resolved_handle text;
begin
  resolved_display_name := coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'Pace Athlete');
  resolved_handle := '@' || left(regexp_replace(lower(resolved_display_name), '[^a-z0-9]+', '', 'g'), 18);

  insert into public.profiles (
    user_id,
    display_name,
    handle,
    bio,
    city,
    preferred_sports,
    weekly_goal_minutes,
    followers_count,
    following_count,
    club_count
  )
  values (
    new.id,
    resolved_display_name,
    resolved_handle,
    '',
    'Set your city',
    '{}',
    null,
    0,
    0,
    0
  )
  on conflict (user_id) do update
  set display_name = excluded.display_name;

  insert into public.privacy_settings (
    user_id,
    profile_visibility,
    activity_visibility,
    map_visibility,
    allow_tagging,
    allow_club_invites
  )
  values (
    new.id,
    'public',
    'followers',
    'start_end_hidden',
    true,
    true
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create policy "profiles are readable by authenticated users"
on public.profiles for select
to authenticated
using (true);

create policy "users insert own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = user_id);

create policy "users update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users read own privacy"
on public.privacy_settings for select
to authenticated
using (auth.uid() = user_id);

create policy "users insert own privacy"
on public.privacy_settings for insert
to authenticated
with check (auth.uid() = user_id);

create policy "users update own privacy"
on public.privacy_settings for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "activities are readable by authenticated users"
on public.activities for select
to authenticated
using (true);

create policy "users insert own activities"
on public.activities for insert
to authenticated
with check (auth.uid() = user_id);

create policy "users update own activities"
on public.activities for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "comments are readable by authenticated users"
on public.comments for select
to authenticated
using (true);

create policy "users insert own comments"
on public.comments for insert
to authenticated
with check (auth.uid() = author_id);

create policy "likes are readable by authenticated users"
on public.likes for select
to authenticated
using (true);

create policy "users insert own likes"
on public.likes for insert
to authenticated
with check (auth.uid() = user_id);

create policy "notifications are readable by owning user"
on public.notifications for select
to authenticated
using (auth.uid() = user_id);

create policy "clubs are readable by authenticated users"
on public.clubs for select
to authenticated
using (true);

create policy "challenges are readable by authenticated users"
on public.challenges for select
to authenticated
using (true);

insert into public.clubs (name, description, member_count, city, sport_types)
values
  ('Harbor Run Collective', 'Intervals on Tuesdays, long runs on Saturdays.', 318, 'San Francisco', '{"run","walk"}'),
  ('Fogline Riders', 'Early start cycling club with weekend climbs.', 196, 'San Francisco', '{"ride"}')
on conflict do nothing;

insert into public.challenges (title, description, sport_types, start_date, end_date, participant_count)
values
  ('April Climb Block', 'Accumulate 2,500 meters of elevation this month.', '{"run","ride","walk"}', current_date, current_date + interval '30 day', 842)
on conflict do nothing;
