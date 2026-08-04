-- Lets the signup endpoint claim and record a journey using only the anon key.
-- Both functions are gated by the unguessable per-signup token, so no
-- service-role key is needed in the serverless function and anon still has no
-- SELECT or UPDATE grant on the table itself.

-- Returns true when this signup should receive the sequence. Returns false if
-- the same address was already welcomed, which keeps repeat submissions from
-- starting a second sequence. Gated by token, so it cannot be used to probe
-- whether an arbitrary address is subscribed.
create or replace function public.oikos_journey_claim(p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_email text;
  v_already boolean;
begin
  select l.email into v_email
  from public.oikos_map_leads l
  where l.unsub_token = p_token
  limit 1;

  if v_email is null then
    return false;
  end if;

  select exists (
    select 1
    from public.oikos_map_leads l
    where l.email = v_email
      and l.unsub_token <> p_token
      and l.welcome_sent_at is not null
  ) into v_already;

  if v_already then
    return false;
  end if;

  update public.oikos_map_leads l
  set welcome_sent_at = now()
  where l.unsub_token = p_token;

  return true;
end;
$$;

-- Stores the queued Resend ids so an unsubscribe can cancel the rest of the
-- sequence. Accepts only a flat array of short text ids.
create or replace function public.oikos_journey_record(p_token uuid, p_ids jsonb)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if jsonb_typeof(p_ids) <> 'array' or jsonb_array_length(p_ids) > 20 then
    return;
  end if;

  if exists (
    select 1 from jsonb_array_elements(p_ids) as elem
    where jsonb_typeof(elem) <> 'string' or length(elem #>> '{}') > 100
  ) then
    return;
  end if;

  update public.oikos_map_leads l
  set scheduled_email_ids = p_ids
  where l.unsub_token = p_token;
end;
$$;

revoke all on function public.oikos_journey_claim(uuid) from public;
revoke all on function public.oikos_journey_record(uuid, jsonb) from public;
grant execute on function public.oikos_journey_claim(uuid) to anon, authenticated;
grant execute on function public.oikos_journey_record(uuid, jsonb) to anon, authenticated;

comment on function public.oikos_journey_claim(uuid) is
  'Token-gated: marks a signup as welcomed and returns false if the address was already on the journey.';
comment on function public.oikos_journey_record(uuid, jsonb) is
  'Token-gated: records queued Resend email ids so an unsubscribe can cancel them.';
