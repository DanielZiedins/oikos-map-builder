-- Adds subscription state for the Oikos Journey email sequence sent via Resend.
alter table public.oikos_map_leads
  add column if not exists email_subscribed boolean not null default true,
  add column if not exists unsub_token uuid not null default gen_random_uuid(),
  add column if not exists welcome_sent_at timestamptz,
  add column if not exists scheduled_email_ids jsonb not null default '[]'::jsonb,
  add column if not exists unsubscribed_at timestamptz;

alter table public.oikos_map_leads
  drop constraint if exists oikos_map_leads_scheduled_ids_array;
alter table public.oikos_map_leads
  add constraint oikos_map_leads_scheduled_ids_array
  check (jsonb_typeof(scheduled_email_ids) = 'array');

create index if not exists oikos_map_leads_unsub_token_idx on public.oikos_map_leads (unsub_token);
create index if not exists oikos_map_leads_subscribed_idx on public.oikos_map_leads (email_subscribed);

-- The signup endpoint inserts the token, so anon needs no extra grants for that.
-- Unsubscribe runs through a SECURITY DEFINER function gated by the unguessable
-- token, mirroring the tkn_command_* RPC pattern: no service-role key in the
-- browser, and no UPDATE grant handed to anon.
create or replace function public.oikos_unsubscribe(p_token uuid)
returns table (email text, scheduled_email_ids jsonb)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_email text;
  v_ids jsonb;
begin
  select l.email into v_email
  from public.oikos_map_leads l
  where l.unsub_token = p_token
  limit 1;

  if v_email is null then
    return;
  end if;

  -- Collect every queued Resend id for this address before clearing them.
  select coalesce(jsonb_agg(elem), '[]'::jsonb) into v_ids
  from public.oikos_map_leads l
  cross join lateral jsonb_array_elements(l.scheduled_email_ids) as elem
  where l.email = v_email;

  update public.oikos_map_leads l
  set email_subscribed = false,
      unsubscribed_at = coalesce(l.unsubscribed_at, now()),
      scheduled_email_ids = '[]'::jsonb
  where l.email = v_email;

  return query select v_email, coalesce(v_ids, '[]'::jsonb);
end;
$$;

revoke all on function public.oikos_unsubscribe(uuid) from public;
grant execute on function public.oikos_unsubscribe(uuid) to anon, authenticated;

comment on function public.oikos_unsubscribe(uuid) is
  'Token-gated unsubscribe for oikosmap.com. Marks every row for the address as unsubscribed and returns the queued Resend email ids so the caller can cancel them.';
