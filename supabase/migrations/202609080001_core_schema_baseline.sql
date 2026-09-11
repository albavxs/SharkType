-- Core SharkType schema baseline reconstructed from the production schema snapshot.
-- This migration is intentionally idempotent so existing linked projects are not
-- modified destructively, while fresh Supabase Preview branches can build the
-- tables required by later migrations.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id),
  username text not null unique check (username ~ '^[a-z0-9_]{3,20}$'::text),
  display_name text,
  avatar_url text,
  provider text,
  email_verified boolean not null default false,
  local_imported_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  onboarding_completed boolean not null default false,
  bio text,
  stats_reconciled_at timestamptz,
  social_seeded_at timestamptz,
  is_super_user boolean not null default false,
  intro_tour_version_seen integer
);

create table if not exists public.user_progress (
  user_id uuid primary key references public.profiles(id),
  total_xp integer not null default 0,
  current_streak integer not null default 0,
  last_practice_date date,
  best_wpm integer not null default 0,
  best_accuracy integer not null default 0,
  total_sessions integer not null default 0,
  updated_at timestamptz not null default timezone('utc'::text, now()),
  completed_track_ids text[] default '{}'::text[],
  ranked_score integer not null default 0,
  ranked_sessions integer not null default 0,
  last_activity_at timestamptz,
  last_streak_at timestamptz
);

create table if not exists public.user_language_progress (
  user_id uuid not null references public.profiles(id),
  language_id text not null,
  completed_snippet_ids jsonb not null default '[]'::jsonb,
  best_wpm integer not null default 0,
  best_accuracy integer not null default 0,
  total_sessions integer not null default 0,
  updated_at timestamptz not null default timezone('utc'::text, now()),
  primary key (user_id, language_id)
);

create table if not exists public.typing_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  language_id text not null,
  snippet_id text not null,
  wpm integer not null default 0,
  accuracy integer not null default 0,
  errors integer not null default 0,
  duration integer not null default 0,
  difficulty text not null,
  xp_earned integer not null default 0,
  created_at timestamptz not null default timezone('utc'::text, now()),
  ranked_points integer not null default 0,
  ranked_eligible boolean not null default false,
  raw_wpm integer not null default 0
);

create table if not exists public.achievements (
  id text primary key,
  category text not null,
  threshold integer,
  icon text not null,
  name_pt text not null,
  name_en text not null,
  description_pt text not null,
  description_en text not null,
  created_at timestamptz default now(),
  rarity text default 'common'::text,
  xp_reward integer default 0,
  hidden boolean default false
);

create table if not exists public.user_achievements (
  user_id uuid not null references auth.users(id),
  achievement_id text not null references public.achievements(id),
  unlocked_at timestamptz default now(),
  primary key (user_id, achievement_id)
);

create table if not exists public.follows (
  follower_id uuid not null references auth.users(id),
  following_id uuid not null references auth.users(id),
  created_at timestamptz default now(),
  primary key (follower_id, following_id)
);

create sequence if not exists public.feed_events_id_seq;

create table if not exists public.feed_events (
  id bigint primary key default nextval('public.feed_events_id_seq'::regclass),
  user_id uuid not null references auth.users(id),
  event_type text not null check (
    event_type = any (array[
      'session'::text,
      'achievement'::text,
      'achievement_unlock'::text,
      'level_up'::text,
      'follow'::text,
      'track_completed'::text,
      'manual_post'::text
    ])
  ),
  payload jsonb not null,
  created_at timestamptz not null default now()
);

alter sequence public.feed_events_id_seq owned by public.feed_events.id;

create table if not exists public.feed_likes (
  id uuid primary key default gen_random_uuid(),
  feed_event_id bigint not null references public.feed_events(id),
  user_id uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.track_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  track_slug text not null,
  completed_at timestamptz not null default now(),
  best_wpm integer,
  accuracy integer
);
