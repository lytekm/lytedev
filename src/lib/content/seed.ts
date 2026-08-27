import type { PostRow, ProjectRow } from "@/lib/supabase/database.types";

export const seedProjects: ProjectRow[] = [
  {
    id: "seed-lyte-engine",
    title: "Lyte Engine",
    slug: "lyte-engine",
    short_description:
      "Replaceable placeholder copy for an engine-focused project space covering rendering, tooling, and low-level experiments.",
    content: `## Project note\n\nThis is seeded placeholder content for **Lyte Engine**. Replace it with the real technical overview, screenshots, architecture notes, or development logs once they are ready.\n\n### Potential topics\n\n- Rendering experiments\n- Tooling and workflows\n- Engine subsystems in progress\n`,
    status: "In Development",
    technologies: ["C++", "OpenGL", "Tooling"],
    github_url: null,
    live_url: null,
    image_url: "/branding/lyte-logo.png",
    featured: true,
    home_highlight: true,
    is_experiment: false,
    published: true,
    sort_order: 1,
    created_at: "2026-01-10T00:00:00.000Z",
    updated_at: "2026-01-10T00:00:00.000Z",
  },
  {
    id: "seed-membrant",
    title: "Membrant",
    slug: "membrant",
    short_description:
      "Replaceable placeholder copy for a software project under the Lyte umbrella, ready for a real product or tooling description.",
    content: `## Project note\n\nThis entry is intentionally conservative until full project details are supplied. Use this space for scope, design decisions, stack notes, and deployment details.`,
    status: "Active",
    technologies: ["TypeScript", "React", "Supabase"],
    github_url: null,
    live_url: null,
    image_url: "/branding/lyte-logo.png",
    featured: true,
    home_highlight: true,
    is_experiment: false,
    published: true,
    sort_order: 2,
    created_at: "2026-01-12T00:00:00.000Z",
    updated_at: "2026-01-12T00:00:00.000Z",
  },
  {
    id: "seed-calorie-tracker",
    title: "Calorie Tracker",
    slug: "calorie-tracker",
    short_description:
      "Replaceable placeholder copy for a practical application focused on everyday use, data tracking, and clean product engineering.",
    content: `## Project note\n\nPlaceholder project content for **Calorie Tracker**. Add the real feature set, data model notes, screenshots, and lessons learned here.`,
    status: "Experimental",
    technologies: ["Next.js", "PostgreSQL", "Analytics"],
    github_url: null,
    live_url: null,
    image_url: "/branding/lyte-logo.png",
    featured: true,
    home_highlight: true,
    is_experiment: false,
    published: true,
    sort_order: 3,
    created_at: "2026-01-14T00:00:00.000Z",
    updated_at: "2026-01-14T00:00:00.000Z",
  },
];

export const seedPosts: PostRow[] = [
  {
    id: "seed-post-1",
    title: "Building a personal engineering notebook",
    slug: "building-a-personal-engineering-notebook",
    excerpt:
      "Placeholder writing sample about documenting tools, experiments, and the work that usually stays in scratch folders.",
    content: `# Building a personal engineering notebook\n\nThis seeded article is placeholder content for the LyteDev blog. Replace it with real writing once the first published post is ready.\n\n## Why keep notes?\n\n- Preserve decisions\n- Track experiments\n- Make future posts easier to write\n\n> Replace this article with real engineering notes, project logs, or technical breakdowns.\n\n\`\`\`ts\nexport function keepShipping() {\n  return "document the process";\n}\n\`\`\`\n`,
    tags: ["notes", "workflow"],
    cover_image_url: "/branding/lyte-logo.png",
    published: true,
    published_at: "2026-02-01T00:00:00.000Z",
    created_at: "2026-02-01T00:00:00.000Z",
    updated_at: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "seed-post-2",
    title: "What belongs on a project page",
    slug: "what-belongs-on-a-project-page",
    excerpt:
      "Placeholder writing sample about balancing concise presentation with enough implementation detail to be useful.",
    content: `# What belongs on a project page\n\nSeed content for the blog index and article layout. Replace with real technical writing.\n\n## Useful sections\n\n1. Problem\n2. Constraints\n3. Stack\n4. Lessons learned\n`,
    tags: ["portfolio", "projects"],
    cover_image_url: "/branding/lyte-logo.png",
    published: true,
    published_at: "2026-02-08T00:00:00.000Z",
    created_at: "2026-02-08T00:00:00.000Z",
    updated_at: "2026-02-08T00:00:00.000Z",
  },
  {
    id: "seed-post-3",
    title: "Small experiments, shipped deliberately",
    slug: "small-experiments-shipped-deliberately",
    excerpt:
      "Placeholder writing sample about treating experiments as durable engineering work instead of disposable side notes.",
    content: `# Small experiments, shipped deliberately\n\nAnother placeholder article to demonstrate the blog system, markdown rendering, and metadata flow.\n\n- Replace this text\n- Add real tags\n- Publish real posts from the admin area\n`,
    tags: ["experiments", "engineering"],
    cover_image_url: "/branding/lyte-logo.png",
    published: true,
    published_at: "2026-02-15T00:00:00.000Z",
    created_at: "2026-02-15T00:00:00.000Z",
    updated_at: "2026-02-15T00:00:00.000Z",
  },
];

export const featuredWork = [
  {
    title: "Lyte Engine",
    label: "Rendering / tooling",
    description: "Placeholder highlight slot for engine work, graphics experiments, and low-level systems notes.",
  },
  {
    title: "Membrant",
    label: "Application / product",
    description: "Placeholder highlight slot for a software project under active development.",
  },
  {
    title: "Calorie Tracker",
    label: "Utility / product",
    description: "Placeholder highlight slot for a practical app with a cleaner public write-up to come.",
  },
  {
    title: "Developer Tools",
    label: "Scripts / internal tools",
    description: "Placeholder highlight slot for CLI tools, automation, and workflow improvements published under LyteDev.",
  },
];
