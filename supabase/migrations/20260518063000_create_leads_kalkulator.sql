-- NURTEX — Supabase backup for Czyste Powietrze calculator leads.
-- Run in Supabase SQL Editor before enabling SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.

create extension if not exists pgcrypto;

create table if not exists public.leads_kalkulator (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  email text not null,
  telefon text,

  poziom text not null check (poziom in ('podstawowy', 'podwyzszony', 'najwyzszy')),
  stary_kociol text check (stary_kociol in ('wegiel', 'gaz', 'olej', 'brak')),
  inwestycja text not null check (inwestycja in ('pompaPow', 'pompaPowEff', 'pompaGrunt', 'kompleks', 'pv')),

  wynik_dotacja integer not null,
  wynik_koszt integer not null,
  wynik_koszt_po_dotacji integer not null,

  source_url text,
  user_agent text,
  ip_address text,

  status text not null default 'new' check (status in ('new', 'contacted', 'meeting', 'quoted', 'won', 'lost')),
  notes text,
  contacted_at timestamptz,

  email_sent_to_client boolean not null default false,
  email_sent_to_nurtex boolean not null default false,
  email_error text
);

create index if not exists idx_leads_kalkulator_created on public.leads_kalkulator (created_at desc);
create index if not exists idx_leads_kalkulator_status on public.leads_kalkulator (status);
create index if not exists idx_leads_kalkulator_email on public.leads_kalkulator (email);

alter table public.leads_kalkulator enable row level security;

drop policy if exists "service_role full access" on public.leads_kalkulator;
create policy "service_role full access"
  on public.leads_kalkulator
  for all
  to service_role
  using (true)
  with check (true);

revoke all on table public.leads_kalkulator from anon, authenticated;
grant select, insert, update, delete on table public.leads_kalkulator to service_role;

create or replace view public.leads_kalkulator_stats
with (security_invoker = true)
as
with daily as (
  select
    date_trunc('day', created_at) as day,
    count(*) as total_leads,
    count(*) filter (where status = 'new') as nowe,
    count(*) filter (where status = 'contacted') as kontaktowane,
    count(*) filter (where status = 'won') as wygrane,
    count(*) filter (where status = 'lost') as stracone,
    avg(wynik_dotacja)::integer as srednia_dotacja,
    sum(wynik_koszt) as suma_kosztow
  from public.leads_kalkulator
  group by date_trunc('day', created_at)
),
breakdown as (
  select
    day,
    jsonb_object_agg(inwestycja, total) as inwestycje_breakdown
  from (
    select
      date_trunc('day', created_at) as day,
      inwestycja,
      count(*) as total
    from public.leads_kalkulator
    group by date_trunc('day', created_at), inwestycja
  ) grouped
  group by day
)
select
  daily.day,
  daily.total_leads,
  daily.nowe,
  daily.kontaktowane,
  daily.wygrane,
  daily.stracone,
  daily.srednia_dotacja,
  daily.suma_kosztow,
  coalesce(breakdown.inwestycje_breakdown, '{}'::jsonb) as inwestycje_breakdown
from daily
left join breakdown using (day)
order by daily.day desc;

revoke all on table public.leads_kalkulator_stats from anon, authenticated;
grant select on table public.leads_kalkulator_stats to service_role;

-- Verify after running:
-- select count(*) from public.leads_kalkulator;
-- select * from public.leads_kalkulator_stats;
