-- Tighten direct-table access without changing the public API/view contract.

-- Feed likes stay publicly readable, but only authenticated users may mutate
-- their own like rows. This prevents direct PostgREST writes that spoof user_id.
alter table public.feed_likes enable row level security;
revoke all on public.feed_likes from anon, authenticated;
grant select on public.feed_likes to anon, authenticated;
grant insert, delete on public.feed_likes to authenticated;
grant all on public.feed_likes to service_role;

drop policy if exists "Feed likes publicly readable" on public.feed_likes;
drop policy if exists "Users can create own feed likes" on public.feed_likes;
drop policy if exists "Users can delete own feed likes" on public.feed_likes;

create policy "Feed likes publicly readable"
  on public.feed_likes
  for select
  to public
  using (true);

create policy "Users can create own feed likes"
  on public.feed_likes
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete own feed likes"
  on public.feed_likes
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Raw progress contains behavioral/account-state fields that do not belong in
-- a public table response. Public ranking continues through the leaderboard
-- views; authenticated users may only read their own raw aggregate row.
alter table public.user_progress enable row level security;
revoke all on public.user_progress from anon, authenticated;
grant select on public.user_progress to authenticated;
grant all on public.user_progress to service_role;

drop policy if exists "user_progress_public_read" on public.user_progress;
drop policy if exists "user_progress_read_own" on public.user_progress;

create policy "user_progress_read_own"
  on public.user_progress
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Legacy completion rows are not part of the current client contract. Keep the
-- table for compatibility, but make it service-role-only until it is removed.
alter table public.track_completions enable row level security;
revoke all on public.track_completions from anon, authenticated;
grant all on public.track_completions to service_role;
