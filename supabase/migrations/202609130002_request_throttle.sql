create table if not exists public.request_throttle_windows (
  throttle_key text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.request_throttle_windows enable row level security;
revoke all on public.request_throttle_windows from anon, authenticated;
grant all on public.request_throttle_windows to service_role;
