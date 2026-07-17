create table if not exists public.oikos_map_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  email text not null,
  interest text not null default 'Send me the Oikos starter kit',
  source text not null default 'oikosmap.com',
  page text not null default '/',
  referrer text,
  user_agent text,
  map_title text,
  center_name text,
  people_count integer not null default 0 check (people_count >= 0 and people_count <= 500),
  first_circle_count integer not null default 0 check (first_circle_count >= 0 and first_circle_count <= 500),
  branch_count integer not null default 0 check (branch_count >= 0 and branch_count <= 500),
  metadata jsonb not null default '{}'::jsonb,
  constraint oikos_map_leads_email_valid check (
    email = lower(btrim(email))
    and char_length(email) >= 5
    and char_length(email) <= 254
    and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  constraint oikos_map_leads_name_len check (name is null or char_length(name) <= 120),
  constraint oikos_map_leads_interest_len check (char_length(interest) between 1 and 120),
  constraint oikos_map_leads_source_len check (char_length(source) between 1 and 80),
  constraint oikos_map_leads_page_len check (char_length(page) between 1 and 500),
  constraint oikos_map_leads_referrer_len check (referrer is null or char_length(referrer) <= 500),
  constraint oikos_map_leads_user_agent_len check (user_agent is null or char_length(user_agent) <= 500),
  constraint oikos_map_leads_map_title_len check (map_title is null or char_length(map_title) <= 140),
  constraint oikos_map_leads_center_name_len check (center_name is null or char_length(center_name) <= 120),
  constraint oikos_map_leads_metadata_object check (jsonb_typeof(metadata) = 'object')
);

comment on table public.oikos_map_leads is 'Lead/resource requests and lightweight Oikos Map engagement captured from oikosmap.com.';

alter table public.oikos_map_leads enable row level security;

revoke all on public.oikos_map_leads from anon, authenticated;
grant insert on public.oikos_map_leads to anon;
grant insert on public.oikos_map_leads to authenticated;

drop policy if exists "Anyone can submit Oikos Map leads" on public.oikos_map_leads;
create policy "Anyone can submit Oikos Map leads"
  on public.oikos_map_leads
  for insert
  to anon, authenticated
  with check (true);

create index if not exists oikos_map_leads_created_at_idx on public.oikos_map_leads (created_at desc);
create index if not exists oikos_map_leads_email_idx on public.oikos_map_leads (email);
create index if not exists oikos_map_leads_interest_idx on public.oikos_map_leads (interest);
