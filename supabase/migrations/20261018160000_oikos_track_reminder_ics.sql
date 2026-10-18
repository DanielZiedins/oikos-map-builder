-- Allow-list reminder_ics (the builder's daily prayer calendar reminder).
create or replace function public.oikos_track(p_event text, p_path text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_path text := left(coalesce(nullif(btrim(p_path), ''), '/'), 200);
begin
  if p_event not in (
    'signup', 'export_png', 'export_svg', 'export_json', 'export_plan', 'copy_plan',
    'print_map', 'share_link', 'share_tool', 'bulk_add', 'prayer_start',
    'outbound', 'article_view', 'article_read', 'journal_filter', 'path_click',
    'share_article', 'download_template', 'reminder_ics'
  ) then
    return;
  end if;

  insert into public.oikos_event_counts as c (day, event, path, count)
  values ((now() at time zone 'utc')::date, p_event, v_path, 1)
  on conflict (day, event, path) do update set count = c.count + 1;
end;
$$;
