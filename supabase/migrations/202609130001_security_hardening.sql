-- Release security hardening: keep account/system state and progress writes server-authoritative.

revoke all on public.profiles from anon, authenticated;

grant select (
  id,
  username,
  display_name,
  avatar_url,
  bio,
  created_at
) on public.profiles to anon, authenticated;

grant all on public.profiles to service_role;

drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

revoke insert, update, delete on public.user_progress from anon, authenticated;
revoke insert, update, delete on public.user_language_progress from anon, authenticated;
revoke insert, update, delete on public.typing_sessions from anon, authenticated;

grant all on public.user_progress to service_role;
grant all on public.user_language_progress to service_role;
grant all on public.typing_sessions to service_role;

drop policy if exists "user_progress_write_own" on public.user_progress;
drop policy if exists "user_language_progress_own" on public.user_language_progress;
drop policy if exists "typing_sessions_own" on public.typing_sessions;

drop policy if exists "user_language_progress_read_own" on public.user_language_progress;
create policy "user_language_progress_read_own"
  on public.user_language_progress
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "typing_sessions_read_own" on public.typing_sessions;
create policy "typing_sessions_read_own"
  on public.typing_sessions
  for select
  to authenticated
  using (auth.uid() = user_id);

grant select on public.user_progress to anon, authenticated;
grant select on public.user_language_progress to authenticated;
grant select on public.typing_sessions to authenticated;
