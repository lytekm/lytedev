import Link from "next/link";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ProjectForm } from "@/components/admin/project-form";
import { StatusBadge } from "@/components/site/status-badge";
import { deleteProjectAction } from "@/app/admin/(protected)/projects/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; create?: string }>;
}) {
  const { edit, create } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  const selectedProject = edit ? projects?.find((project) => project.id === edit) ?? null : create ? null : projects?.[0] ?? null;

  return (
    <section className="shell page-section admin-split">
      <div className="stack-md">
        <div className="admin-toolbar">
          <div>
            <p className="eyebrow">Projects</p>
            <h1>Manage projects</h1>
          </div>
          <Link href="/admin/projects?create=1" className="button button--primary">
            New project
          </Link>
        </div>

        <div className="list-panel">
          {projects?.map((project) => (
            <article key={project.id} className="card admin-list-item">
              <div className="stack-sm">
                <div className="card-meta">
                  <StatusBadge status={project.status} subtle />
                  {project.published ? <span className="chip chip--active">Published</span> : <span className="chip">Draft</span>}
                  {project.featured ? <span className="chip">Featured</span> : null}
                </div>
                <div>
                  <h2>{project.title}</h2>
                  <p className="muted">{project.short_description}</p>
                </div>
                <p className="meta-row">/{project.slug}</p>
              </div>

              <div className="admin-item-actions">
                <Link href={`/admin/projects?edit=${project.id}`} className="button">
                  Edit
                </Link>
                <form action={deleteProjectAction}>
                  <input type="hidden" name="id" value={project.id} />
                  <ConfirmButton label="Delete" message={`Delete ${project.title}? This cannot be undone.`} />
                </form>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ProjectForm project={selectedProject} />
    </section>
  );
}
