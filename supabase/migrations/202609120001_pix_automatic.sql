-- Pix Automatic authorization state for SharkType Plus.
-- The payer CPF/CNPJ is intentionally NOT stored here; it is sent only to Asaas customer registration.

create table if not exists public.billing_pix_authorizations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null default 'asaas' check (provider = 'asaas'),
  provider_authorization_id text not null unique,
  provider_customer_id text not null,
  plan_key text not null check (plan_key in ('monthly', 'quarterly', 'semiannual', 'annual')),
  status text not null default 'CREATED',
  frequency text not null,
  amount numeric(10,2) not null check (amount > 0),
  sandbox boolean not null default true,
  conciliation_identifier text,
  qr_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists billing_pix_authorizations_user_idx
  on public.billing_pix_authorizations(user_id, created_at desc);
create index if not exists billing_pix_authorizations_customer_idx
  on public.billing_pix_authorizations(provider_customer_id, created_at desc);

alter table public.billing_pix_authorizations enable row level security;
revoke all on public.billing_pix_authorizations from anon, authenticated;
grant select on public.billing_pix_authorizations to authenticated;
grant all on public.billing_pix_authorizations to service_role;

create policy "Users can read own Pix authorizations"
  on public.billing_pix_authorizations for select to authenticated
  using (auth.uid() = user_id);

drop trigger if exists billing_pix_authorizations_touch_updated_at on public.billing_pix_authorizations;
create trigger billing_pix_authorizations_touch_updated_at
before update on public.billing_pix_authorizations
for each row execute function public.touch_billing_updated_at();
