-- Profiles that exist when versioned onboarding is introduced are legacy users.
-- Mark them as having completed the current intro + keyboard guide so they are
-- not unexpectedly forced through onboarding on their next login.
update public.profiles
set intro_tour_version_seen = 2
where coalesce(intro_tour_version_seen, 0) < 2;
