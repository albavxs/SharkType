-- P0 rollback: remove the entitlement/billing schema introduced by
-- 202609090001_plus_entitlements.sql while authentication authorization is audited.
-- Keep the original migration in history so already-linked Supabase projects do
-- not end up with a missing migration version.

drop table if exists public.billing_events cascade;
drop table if exists public.entitlement_audit_events cascade;
drop table if exists public.user_entitlements cascade;
