import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const cards = [
  { href: "/admin/projects", title: "Projects", description: "Create, edit, publish, feature, and order portfolio projects." },
  { href: "/admin/posts", title: "Blog Posts", description: "Manage draft and published markdown posts with tags and cover images." },
  { href: "/admin/media", title: "Media", description: "Review storage usage expectations and image references across content." },
];

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const [{ count: projectCount }, { count: postCount }] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }),
  ]);

  return (
    <section className="shell page-section stack-lg">
      <div className="section-heading">
        <p className="eyebrow">Dashboard</p>
        <h1>Content management</h1>
        <p className="muted">A simple internal workspace for the LyteDev project archive, blog, and media workflow.</p>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <span className="eyebrow">Projects</span>
          <strong>{projectCount ?? 0}</strong>
        </div>
        <div className="card stat-card">
          <span className="eyebrow">Posts</span>
          <strong>{postCount ?? 0}</strong>
        </div>
      </div>

      <div className="admin-card-grid">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="card admin-link-card">
            <h2>{card.title}</h2>
            <p className="muted">{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
