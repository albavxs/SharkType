create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  display_name text,
  avatar_url text,
  provider text,
  email_verified boolean not null default false,
  local_imported_at timestamptz,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,20}$')
);

create table if not exists public.user_progress (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  total_xp integer not null default 0,
  current_streak integer not null default 0,
  last_practice_date date,
  best_wpm integer not null default 0,
  best_accuracy integer not null default 0,
  total_sessions integer not null default 0,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_language_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  language_id text not null,
  completed_snippet_ids jsonb not null default '[]'::jsonb,
  best_wpm integer not null default 0,
  best_accuracy integer not null default 0,
  total_sessions integer not null default 0,
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, language_id)
);

create table if not exists public.typing_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  language_id text not null,
  snippet_id text not null,
  wpm integer not null default 0,
  accuracy integer not null default 0,
  errors integer not null default 0,
  duration integer not null default 0,
  difficulty text not null,
  xp_earned integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists typing_sessions_user_created_at_idx on public.typing_sessions (user_id, created_at desc);
create index if not exists user_progress_total_xp_idx on public.user_progress (total_xp desc, best_wpm desc, current_streak desc);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists user_progress_set_updated_at on public.user_progress;
create trigger user_progress_set_updated_at
before update on public.user_progress
for each row
execute function public.set_updated_at();

drop trigger if exists user_language_progress_set_updated_at on public.user_language_progress;
create trigger user_language_progress_set_updated_at
before update on public.user_language_progress
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.user_language_progress enable row level security;
alter table public.typing_sessions enable row level security;

drop policy if exists "profiles_public_read" on public.profiles;
create policy "profiles_public_read"
on public.profiles
for select
to anon, authenticated
using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "user_progress_public_read" on public.user_progress;
create policy "user_progress_public_read"
on public.user_progress
for select
to anon, authenticated
using (true);

drop policy if exists "user_progress_write_own" on public.user_progress;
create policy "user_progress_write_own"
on public.user_progress
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "user_language_progress_own" on public.user_language_progress;
create policy "user_language_progress_own"
on public.user_language_progress
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "typing_sessions_own" on public.typing_sessions;
create policy "typing_sessions_own"
on public.typing_sessions
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace view public.global_leaderboard as
select
  p.id as user_id,
  p.username,
  p.display_name,
  p.avatar_url,
  coalesce(up.total_xp, 0) as total_xp,
  coalesce(up.best_wpm, 0) as best_wpm,
  coalesce(up.current_streak, 0) as current_streak,
  coalesce(up.total_sessions, 0) as total_sessions
from public.profiles p
left join public.user_progress up on up.user_id = p.id;

grant select on public.global_leaderboard to anon, authenticated;

comment on view public.global_leaderboard is 'Public leaderboard for SharkType ordered in the app by XP, WPM and streak.';
comment on table public.profiles is 'Configure Supabase Auth email templates to send {{ .Token }} for the signup confirmation flow used by SharkType.';
