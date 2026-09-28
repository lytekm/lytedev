import Link from "next/link";
import { cookies } from "next/headers";
import { AnalyticsPanel } from "@/components/admin/analytics-panel";
import { getAnalyticsReport, isAnalyticsEnabled } from "@/lib/analytics/server";
import { ANALYTICS_EXCLUSION_COOKIE, getAnalyticsRange } from "@/lib/analytics/shared";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const cards = [
  { href: "/admin/projects", title: "Projects", description: "Edit project details, change their order, and choose home page highlights." },
  { href: "/admin/posts", title: "Blog Posts", description: "Write a draft, update a post, or publish something new." },
  { href: "/admin/media", title: "Media", description: "Find uploaded images and copy links to use in your content." },
];

export default async function AdminDashboardPage({ searchParams }: {
  searchParams: Promise<{ days?: string | string[] }>;
}) {
  const session = await requireAdmin();
  if (!session.configured) return null;

  const days = getAnalyticsRange((await searchParams).days);
  const cookieStore = await cookies();
  // The admin proxy sets the exclusion on first sign-in. An explicit "0" opts
  // this browser back in only when signed out.
  const browserExcluded = cookieStore.get(ANALYTICS_EXCLUSION_COOKIE)?.value !== "0";
  const supabase = await createSupabaseServerClient();
  const [{ count: projectCount }, { count: postCount }, analytics] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    getAnalyticsReport(days),
  ]);

  return (
    <section className="shell page-section stack-lg">
      <div className="section-heading">
        <p className="eyebrow">Dashboard</p>
        <h1>Site overview</h1>
        <p className="muted">See what’s being read and keep your projects and posts up to date.</p>
      </div>

      <AnalyticsPanel result={analytics} days={days} browserExcluded={browserExcluded} trackingEnabled={isAnalyticsEnabled()} />

      <h2>Manage content</h2>
      <div className="admin-card-grid">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="card admin-link-card">
            <h3>{card.title}</h3>
            <p className="muted">{card.description}</p>
            {card.href === "/admin/projects" ? <span className="meta-row">{projectCount ?? 0} projects</span> : null}
            {card.href === "/admin/posts" ? <span className="meta-row">{postCount ?? 0} posts</span> : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
