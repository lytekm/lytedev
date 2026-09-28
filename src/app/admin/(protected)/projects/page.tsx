import Link from "next/link";
import { AdminModal } from "@/components/admin/admin-modal";
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

  const selectedProject = edit ? projects?.find((project) => project.id === edit) ?? null : null;
  const isModalOpen = Boolean(create || selectedProject);
  const totalProjects = projects?.length ?? 0;
  const publishedProjects = projects?.filter((project) => project.published).length ?? 0;
  const highlightedProjects = projects?.filter((project) => project.home_highlight).length ?? 0;
  const experiments = projects?.filter((project) => project.is_experiment).length ?? 0;

  return (
    <>
      <section className="shell page-section stack-lg">
        <div className="admin-toolbar">
          <div className="admin-page-head">
            <p className="eyebrow">Projects</p>
            <h1>Manage projects</h1>
            <p className="muted">Update project details, choose what appears on the home page, and publish when you’re ready.</p>
          </div>
          <Link href="/admin/projects?create=1" className="button button--primary">
            New project
          </Link>
        </div>

        <div className="admin-summary-grid">
          <article className="card stat-card">
            <span className="eyebrow">Total projects</span>
            <strong>{totalProjects}</strong>
          </article>
          <article className="card stat-card">
            <span className="eyebrow">Published</span>
            <strong>{publishedProjects}</strong>
          </article>
          <article className="card stat-card">
            <span className="eyebrow">Home highlights</span>
            <strong>{highlightedProjects}</strong>
          </article>
          <article className="card stat-card">
            <span className="eyebrow">Experiments</span>
            <strong>{experiments}</strong>
          </article>
        </div>

        <div className="list-panel">
          <div className="admin-list-header">
            <div>
              <p className="eyebrow">Portfolio</p>
              <h2>All projects</h2>
            </div>
            <p className="muted">Lower display-order numbers appear first. Drafts are only visible here.</p>
          </div>

          <div className="admin-collection">
            {projects?.map((project) => (
              <article key={project.id} className="card admin-list-item">
                <div className="stack-sm">
                  <div className="card-meta">
                    <StatusBadge status={project.status} subtle />
                    {project.published ? <span className="chip chip--active">Published</span> : <span className="chip">Draft</span>}
                    {project.featured ? <span className="chip">Main project</span> : null}
                    {project.home_highlight ? <span className="chip">Home highlight</span> : null}
                    {project.is_experiment ? <span className="chip">Experiment</span> : null}
                  </div>
                  <div className="stack-sm">
                    <h2>{project.title}</h2>
                    <p className="muted">{project.short_description}</p>
                  </div>
                  <p className="meta-row">/{project.slug} / Order {project.sort_order}</p>
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
      </section>

      {isModalOpen ? (
        <AdminModal label={selectedProject ? `Edit ${selectedProject.title}` : "Create project"} closeHref="/admin/projects">
          <ProjectForm key={selectedProject?.id ?? "new-project"} project={selectedProject} cancelHref="/admin/projects" />
        </AdminModal>
      ) : null}
    </>
  );
}
