-- Privacy-respecting usage counts for oikosmap.com.
-- Aggregates only: (day, event, path) -> count. No user ids, no IP, no cookies,
-- nothing that identifies a person. Written through a SECURITY DEFINER function
-- with an allow-list, so anon has no direct access to the table at all.
create table if not exists public.oikos_event_counts (
  day date not null default (now() at time zone 'utc')::date,
  event text not null,
  path text not null default '/',
  count integer not null default 0 check (count >= 0),
  primary key (day, event, path),
  constraint oikos_event_counts_event_len check (char_length(event) between 1 and 40),
  constraint oikos_event_counts_path_len check (char_length(path) between 1 and 200)
);

comment on table public.oikos_event_counts is
  'Daily aggregate counts of key actions on oikosmap.com. No personal data.';

alter table public.oikos_event_counts enable row level security;
revoke all on public.oikos_event_counts from anon, authenticated;

create or replace function public.oikos_track(p_event text, p_path text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_path text := left(coalesce(nullif(btrim(p_path), ''), '/'), 200);
begin
  -- Allow-list: unknown events are dropped silently rather than stored.
  if p_event not in (
    'signup', 'export_png', 'export_svg', 'export_json', 'export_plan', 'copy_plan',
    'print_map', 'share_link', 'share_tool', 'bulk_add', 'prayer_start',
    'outbound', 'article_view', 'article_read', 'journal_filter', 'path_click'
  ) then
    return;
  end if;

  insert into public.oikos_event_counts as c (day, event, path, count)
  values ((now() at time zone 'utc')::date, p_event, v_path, 1)
  on conflict (day, event, path) do update set count = c.count + 1;
end;
$$;

revoke all on function public.oikos_track(text, text) from public;
grant execute on function public.oikos_track(text, text) to anon, authenticated;
