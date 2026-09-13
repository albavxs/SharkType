-- Profiles that exist when versioned onboarding is introduced are legacy users.
-- Some existing databases predate the intro_tour_version_seen column, so add it
-- safely before backfilling the legacy cohort.
alter table public.profiles
  add column if not exists intro_tour_version_seen integer default 0;

alter table public.profiles
  alter column intro_tour_version_seen set default 0;

-- Mark every profile that exists at migration time as having completed the
-- current intro + keyboard guide. New profiles created afterwards start at 0.
update public.profiles
set intro_tour_version_seen = 2
where coalesce(intro_tour_version_seen, 0) < 2;
