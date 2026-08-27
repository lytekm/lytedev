create extension if not exists pgcrypto;

create type public.project_status as enum (
  'Active',
  'Released',
  'Experimental',
  'Archived',
  'In Development'
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null,
  content text not null,
  status public.project_status not null default 'In Development',
  technologies text[] not null default '{}',
  github_url text,
  live_url text,
  image_url text,
  featured boolean not null default false,
  home_highlight boolean not null default false,
  is_experiment boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  tags text[] not null default '{}',
  cover_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists projects_published_sort_idx on public.projects (published, featured, home_highlight, is_experiment, sort_order, updated_at desc);
create index if not exists posts_published_date_idx on public.posts (published, published_at desc, updated_at desc);
create index if not exists projects_status_idx on public.projects (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
before update on public.posts
for each row
execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

grant usage on schema public to anon, authenticated;
grant select on public.projects, public.posts to anon, authenticated;
grant select on public.admin_users to authenticated;
grant insert, update, delete on public.projects, public.posts to authenticated;

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.posts enable row level security;

create policy "admin users can read their own admin row"
on public.admin_users
for select
to authenticated
using (auth.uid() = user_id);

create policy "public can read published projects"
on public.projects
for select
to anon, authenticated
using (published = true or public.is_admin());

create policy "admins manage projects"
on public.projects
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can read published posts"
on public.posts
for select
to anon, authenticated
using (published = true or public.is_admin());

create policy "admins manage posts"
on public.posts
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public can view media"
on storage.objects
for select
to public
using (bucket_id = 'media');

create policy "admins can upload media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'media' and public.is_admin());

create policy "admins can update media"
on storage.objects
for update
to authenticated
using (bucket_id = 'media' and public.is_admin())
with check (bucket_id = 'media' and public.is_admin());

create policy "admins can delete media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'media' and public.is_admin());
