create table if not exists public.request_throttle_windows (
  throttle_key text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.request_throttle_windows enable row level security;
revoke all on public.request_throttle_windows from anon, authenticated;
grant all on public.request_throttle_windows to service_role;

create or replace function public.consume_request_throttle(
  p_key text,
  p_max_requests integer,
  p_window_seconds integer
)
returns table(success boolean, remaining integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_count integer;
begin
  if p_key is null or length(trim(p_key)) = 0 or length(p_key) > 240 then
    raise exception 'invalid throttle key';
  end if;

  if p_max_requests < 1 or p_window_seconds < 1 then
    raise exception 'invalid throttle configuration';
  end if;

  insert into public.request_throttle_windows as throttle (
    throttle_key,
    window_started_at,
    request_count,
    updated_at
  )
  values (p_key, v_now, 1, v_now)
  on conflict (throttle_key) do update
  set
    request_count = case
      when throttle.window_started_at <= v_now - make_interval(secs => p_window_seconds) then 1
      else throttle.request_count + 1
    end,
    window_started_at = case
      when throttle.window_started_at <= v_now - make_interval(secs => p_window_seconds) then v_now
      else throttle.window_started_at
    end,
    updated_at = v_now
  returning request_count into v_count;

  success := v_count <= p_max_requests;
  remaining := greatest(p_max_requests - v_count, 0);
  return next;
end;
$$;

revoke all on function public.consume_request_throttle(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_request_throttle(text, integer, integer) to service_role;
