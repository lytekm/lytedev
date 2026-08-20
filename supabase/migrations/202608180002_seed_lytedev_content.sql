insert into public.projects (
  title,
  slug,
  short_description,
  content,
  status,
  technologies,
  image_url,
  featured,
  published,
  sort_order
)
values
  (
    'Lyte Engine',
    'lyte-engine',
    'Replaceable placeholder copy for an engine-focused project space covering rendering, tooling, and low-level experiments.',
    E'## Project note\n\nThis is seeded placeholder content for **Lyte Engine**. Replace it with the real technical overview, screenshots, architecture notes, or development logs once they are ready.\n\n### Potential topics\n\n- Rendering experiments\n- Tooling and workflows\n- Engine subsystems in progress',
    'In Development',
    array['C++', 'OpenGL', 'Tooling'],
    '/branding/lyte-logo.png',
    true,
    true,
    1
  ),
  (
    'Membrant',
    'membrant',
    'Replaceable placeholder copy for a software project under the Lyte umbrella, ready for a real product or tooling description.',
    E'## Project note\n\nThis entry is intentionally conservative until full project details are supplied. Use this space for scope, design decisions, stack notes, and deployment details.',
    'Active',
    array['TypeScript', 'React', 'Supabase'],
    '/branding/lyte-logo.png',
    true,
    true,
    2
  ),
  (
    'Calorie Tracker',
    'calorie-tracker',
    'Replaceable placeholder copy for a practical application focused on everyday use, data tracking, and clean product engineering.',
    E'## Project note\n\nPlaceholder project content for **Calorie Tracker**. Add the real feature set, data model notes, screenshots, and lessons learned here.',
    'Experimental',
    array['Next.js', 'PostgreSQL', 'Analytics'],
    '/branding/lyte-logo.png',
    true,
    true,
    3
  )
on conflict (slug) do nothing;

insert into public.posts (
  title,
  slug,
  excerpt,
  content,
  tags,
  cover_image_url,
  published,
  published_at
)
values
  (
    'Building a personal engineering notebook',
    'building-a-personal-engineering-notebook',
    'Placeholder writing sample about documenting tools, experiments, and the work that usually stays in scratch folders.',
    E'# Building a personal engineering notebook\n\nThis seeded article is placeholder content for the LyteDev blog. Replace it with real writing once the first published post is ready.\n\n## Why keep notes?\n\n- Preserve decisions\n- Track experiments\n- Make future posts easier to write\n\n> Replace this article with real engineering notes, project logs, or technical breakdowns.\n\n```ts\nexport function keepShipping() {\n  return "document the process";\n}\n```',
    array['notes', 'workflow'],
    '/branding/lyte-logo.png',
    true,
    timezone('utc', now()) - interval '14 days'
  ),
  (
    'What belongs on a project page',
    'what-belongs-on-a-project-page',
    'Placeholder writing sample about balancing concise presentation with enough implementation detail to be useful.',
    E'# What belongs on a project page\n\nSeed content for the blog index and article layout. Replace with real technical writing.\n\n## Useful sections\n\n1. Problem\n2. Constraints\n3. Stack\n4. Lessons learned',
    array['portfolio', 'projects'],
    '/branding/lyte-logo.png',
    true,
    timezone('utc', now()) - interval '7 days'
  ),
  (
    'Small experiments, shipped deliberately',
    'small-experiments-shipped-deliberately',
    'Placeholder writing sample about treating experiments as durable engineering work instead of disposable side notes.',
    E'# Small experiments, shipped deliberately\n\nAnother placeholder article to demonstrate the blog system, markdown rendering, and metadata flow.\n\n- Replace this text\n- Add real tags\n- Publish real posts from the admin area',
    array['experiments', 'engineering'],
    '/branding/lyte-logo.png',
    true,
    timezone('utc', now()) - interval '2 days'
  )
on conflict (slug) do nothing;
