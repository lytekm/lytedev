-- Page views only: no visitor IDs, IP addresses, referrers, or query strings.
create table public.page_views (
  event_id uuid primary key,
  path text not null check (
    length(path) <= 512
    and (path in ('/', '/projects', '/blog', '/about') or path ~ '^/(projects|blog)/[a-z0-9-]+$')
  ),
  viewed_at timestamptz not null default now()
);

create index page_views_viewed_at_idx on public.page_views (viewed_at desc);
create index page_views_path_viewed_at_idx on public.page_views (path, viewed_at desc);

alter table public.page_views enable row level security;
revoke all on public.page_views from anon, authenticated;
grant select on public.page_views to authenticated;

create policy "admins can read page views"
on public.page_views for select to authenticated
using (public.is_admin());

-- Collect through this function only. The database controls timestamps, validates
-- published routes, excludes admins, and makes duplicate event deliveries harmless.
create or replace function public.record_page_view(p_path text, p_event_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.is_admin() or p_event_id is null or p_path is null or length(p_path) > 512 then
    return;
  end if;

  if p_path not in ('/', '/projects', '/blog', '/about') then
    if p_path ~ '^/projects/[a-z0-9-]+$' then
      if not exists (select 1 from public.projects where published and '/projects/' || slug = p_path) then
        return;
      end if;
    elsif p_path ~ '^/blog/[a-z0-9-]+$' then
      if not exists (select 1 from public.posts where published and '/blog/' || slug = p_path) then
        return;
      end if;
    else
      return;
    end if;
  end if;

  insert into public.page_views (event_id, path)
  values (p_event_id, p_path)
  on conflict (event_id) do nothing;
end;
$$;

revoke all on function public.record_page_view(text, uuid) from public;
grant execute on function public.record_page_view(text, uuid) to anon, authenticated;

-- Aggregate in Postgres so totals aren't truncated by the API's row limit.
create or replace function public.get_page_view_report(p_days integer default 30)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  today_utc timestamptz := date_trunc('day', now() at time zone 'UTC') at time zone 'UTC';
  starts_at timestamptz;
  report jsonb;
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  if p_days is null or p_days not in (7, 30, 90) then
    raise exception 'Choose 7, 30, or 90 days' using errcode = '22023';
  end if;
  starts_at := today_utc - (p_days - 1) * interval '24 hours';

  with views as materialized (
    select path, viewed_at from public.page_views
    where viewed_at >= starts_at and viewed_at <= now()
  ), daily as (
    select (viewed_at at time zone 'UTC')::date as day, count(*) as views
    from views group by 1
  ), calendar as (
    select (starts_at at time zone 'UTC')::date + n as day
    from generate_series(0, p_days - 1) as series(n)
  ), pages as (
    select path, count(*) as views, min(viewed_at) as first_viewed_at, max(viewed_at) as last_viewed_at
    from views group by path
  ), named_pages as (
    select pages.*,
      coalesce(
        case pages.path when '/' then 'Home' when '/projects' then 'Projects'
          when '/blog' then 'Blog' when '/about' then 'About' end,
        projects.title, posts.title, pages.path
      ) as title
    from pages
    left join public.projects on '/projects/' || projects.slug = pages.path
    left join public.posts on '/blog/' || posts.slug = pages.path
  ), recent as (
    select path, viewed_at from views order by viewed_at desc limit 50
  )
  select jsonb_build_object(
    'total_views', (select count(*) from views),
    'today_views', (select count(*) from views where viewed_at >= today_utc),
    'pages_viewed', (select count(*) from pages),
    'daily', (select coalesce(jsonb_agg(jsonb_build_object(
      'date', calendar.day, 'views', coalesce(daily.views, 0)
    ) order by calendar.day), '[]'::jsonb) from calendar left join daily using (day)),
    'pages', (select coalesce(jsonb_agg(to_jsonb(named_pages) order by views desc, path), '[]'::jsonb) from named_pages),
    'recent', (select coalesce(jsonb_agg(to_jsonb(recent) order by viewed_at desc), '[]'::jsonb) from recent)
  ) into report;

  return report;
end;
$$;

revoke all on function public.get_page_view_report(integer) from public;
grant execute on function public.get_page_view_report(integer) to authenticated;
