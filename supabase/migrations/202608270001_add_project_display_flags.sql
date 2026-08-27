alter table public.projects
add column if not exists home_highlight boolean not null default false,
add column if not exists is_experiment boolean not null default false;

update public.projects
set home_highlight = featured
where home_highlight = false
  and featured = true;

create index if not exists projects_display_sections_idx
on public.projects (published, featured, home_highlight, is_experiment, sort_order, updated_at desc);
