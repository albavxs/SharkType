-- Baseline de seguranca para Supabase / Postgres.
-- Aplicar em ambiente de banco com revisao previa, porque muda RLS e storage.

do $$
begin
  if to_regclass('public.profiles') is null then
    raise notice 'public.profiles not found; skipping.';
  else
    alter table public.profiles enable row level security;

    drop policy if exists profiles_public_read on public.profiles;
    create policy profiles_public_read
      on public.profiles
      for select
      using (true);

    drop policy if exists profiles_self_insert on public.profiles;
    create policy profiles_self_insert
      on public.profiles
      for insert
      to authenticated
      with check (auth.uid() = id);

    drop policy if exists profiles_self_update on public.profiles;
    create policy profiles_self_update
      on public.profiles
      for update
      to authenticated
      using (auth.uid() = id)
      with check (auth.uid() = id);
  end if;
end $$;

do $$
begin
  if to_regclass('public.user_progress') is null then
    raise notice 'public.user_progress not found; skipping.';
  else
    alter table public.user_progress enable row level security;

    drop policy if exists user_progress_public_read on public.user_progress;
    create policy user_progress_public_read
      on public.user_progress
      for select
      using (true);

    drop policy if exists user_progress_self_insert on public.user_progress;
    create policy user_progress_self_insert
      on public.user_progress
      for insert
      to authenticated
      with check (auth.uid() = user_id);

    drop policy if exists user_progress_self_update on public.user_progress;
    create policy user_progress_self_update
      on public.user_progress
      for update
      to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);

    drop policy if exists user_progress_self_delete on public.user_progress;
    create policy user_progress_self_delete
      on public.user_progress
      for delete
      to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if to_regclass('public.user_language_progress') is null then
    raise notice 'public.user_language_progress not found; skipping.';
  else
    alter table public.user_language_progress enable row level security;

    drop policy if exists user_language_progress_public_read on public.user_language_progress;
    create policy user_language_progress_public_read
      on public.user_language_progress
      for select
      using (true);

    drop policy if exists user_language_progress_self_insert on public.user_language_progress;
    create policy user_language_progress_self_insert
      on public.user_language_progress
      for insert
      to authenticated
      with check (auth.uid() = user_id);

    drop policy if exists user_language_progress_self_update on public.user_language_progress;
    create policy user_language_progress_self_update
      on public.user_language_progress
      for update
      to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);

    drop policy if exists user_language_progress_self_delete on public.user_language_progress;
    create policy user_language_progress_self_delete
      on public.user_language_progress
      for delete
      to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if to_regclass('public.typing_sessions') is null then
    raise notice 'public.typing_sessions not found; skipping.';
  else
    alter table public.typing_sessions enable row level security;

    drop policy if exists typing_sessions_self_read on public.typing_sessions;
    create policy typing_sessions_self_read
      on public.typing_sessions
      for select
      to authenticated
      using (auth.uid() = user_id);

    drop policy if exists typing_sessions_self_insert on public.typing_sessions;
    create policy typing_sessions_self_insert
      on public.typing_sessions
      for insert
      to authenticated
      with check (auth.uid() = user_id);

    drop policy if exists typing_sessions_self_delete on public.typing_sessions;
    create policy typing_sessions_self_delete
      on public.typing_sessions
      for delete
      to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if to_regclass('public.feed_events') is null then
    raise notice 'public.feed_events not found; skipping.';
  else
    alter table public.feed_events enable row level security;

    drop policy if exists feed_events_public_read on public.feed_events;
    create policy feed_events_public_read
      on public.feed_events
      for select
      using (true);

    drop policy if exists feed_events_self_insert on public.feed_events;
    create policy feed_events_self_insert
      on public.feed_events
      for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if to_regclass('public.feed_likes') is null then
    raise notice 'public.feed_likes not found; skipping.';
  else
    alter table public.feed_likes enable row level security;

    drop policy if exists feed_likes_public_read on public.feed_likes;
    create policy feed_likes_public_read
      on public.feed_likes
      for select
      using (true);

    drop policy if exists feed_likes_self_insert on public.feed_likes;
    create policy feed_likes_self_insert
      on public.feed_likes
      for insert
      to authenticated
      with check (auth.uid() = user_id);

    drop policy if exists feed_likes_self_delete on public.feed_likes;
    create policy feed_likes_self_delete
      on public.feed_likes
      for delete
      to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if to_regclass('public.follows') is null then
    raise notice 'public.follows not found; skipping.';
  else
    alter table public.follows enable row level security;

    drop policy if exists follows_public_read on public.follows;
    create policy follows_public_read
      on public.follows
      for select
      using (true);

    drop policy if exists follows_self_insert on public.follows;
    create policy follows_self_insert
      on public.follows
      for insert
      to authenticated
      with check (auth.uid() = follower_id);

    drop policy if exists follows_self_delete on public.follows;
    create policy follows_self_delete
      on public.follows
      for delete
      to authenticated
      using (auth.uid() = follower_id);
  end if;
end $$;

do $$
begin
  if to_regclass('storage.objects') is null then
    raise notice 'storage.objects not found; skipping storage policies.';
  else
    insert into storage.buckets (id, name, public)
    values ('avatars', 'avatars', true)
    on conflict (id) do nothing;

    drop policy if exists avatars_public_read on storage.objects;
    create policy avatars_public_read
      on storage.objects
      for select
      using (bucket_id = 'avatars');

    drop policy if exists avatars_self_insert on storage.objects;
    create policy avatars_self_insert
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = auth.uid()::text
      );

    drop policy if exists avatars_self_update on storage.objects;
    create policy avatars_self_update
      on storage.objects
      for update
      to authenticated
      using (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = auth.uid()::text
      )
      with check (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = auth.uid()::text
      );

    drop policy if exists avatars_self_delete on storage.objects;
    create policy avatars_self_delete
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = auth.uid()::text
      );
  end if;
end $$;
