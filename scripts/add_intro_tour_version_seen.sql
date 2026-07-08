alter table public.profiles
  add column if not exists intro_tour_version_seen integer;

update public.profiles
set intro_tour_version_seen = coalesce(intro_tour_version_seen, 0)
where intro_tour_version_seen is null;
