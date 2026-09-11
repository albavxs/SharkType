-- Prevent authenticated clients from promoting themselves to super admin.
-- Keep profile self-service limited to the columns the application legitimately edits.

revoke insert, update on public.profiles from anon, authenticated;

grant insert (
  id,
  username,
  display_name,
  avatar_url,
  bio,
  provider,
  email_verified,
  local_imported_at,
  onboarding_completed,
  intro_tour_version_seen,
  stats_reconciled_at,
  social_seeded_at
) on public.profiles to authenticated;

grant update (
  username,
  display_name,
  avatar_url,
  bio,
  provider,
  email_verified,
  local_imported_at,
  onboarding_completed,
  intro_tour_version_seen,
  stats_reconciled_at,
  social_seeded_at
) on public.profiles to authenticated;

-- is_super_user is intentionally excluded from INSERT/UPDATE grants.
-- Server-side administration continues through service_role.
grant all on public.profiles to service_role;
