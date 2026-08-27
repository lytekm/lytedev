import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/site/empty-state";
import { ProjectCard } from "@/components/site/project-card";
import { ProjectIndexItem } from "@/components/site/project-index-item";
import { filterProjectsByStatus, getProjectStatuses, getPublishedProjects } from "@/lib/content/queries";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Projects",
  description: "Project archive for LyteDev.",
  alternates: {
    canonical: "/projects",
  },
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const [allProjects, projects] = await Promise.all([getPublishedProjects(), filterProjectsByStatus(status)]);
  const statuses = getProjectStatuses(allProjects);
  const featuredProjects = projects.filter((project) => project.featured);
  const experiments = projects.filter((project) => project.is_experiment);

  return (
    <section className={`shell page-section ${styles.page}`}>
      <div className="page-intro">
        <p className="kicker">Projects</p>
        <h1>Project archive</h1>
        <p>Selected work gets the larger treatment. The rest lives in a compact lab index.</p>
      </div>

      <div className={styles.filters} aria-label="Project filters">
        {statuses.map((item) => {
          const active = (status ?? "All") === item;
          const href = item === "All" ? "/projects" : `/projects?status=${encodeURIComponent(item)}`;
          return (
            <Link key={item} href={href} className={active ? "filter-link filter-link--active" : "filter-link"}>
              {item}
            </Link>
          );
        })}
      </div>

      {projects.length ? (
        <>
          {featuredProjects.length ? (
            <div className="section-stack site-section">
              <div className="section-intro">
                <h2>Selected Work</h2>
                <p>Longer-form project entries with enough space for context, stack, and current status.</p>
              </div>
              <div className="feature-stack">
                {featuredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} priority={index === 0} />
                ))}
              </div>
            </div>
          ) : null}

          {experiments.length ? (
            <div className="section-stack site-section">
              <div className="section-intro">
                <h2>Lab / Experiments</h2>
                <p>Smaller builds, prototypes, and practical software that do not need a full-width presentation to be useful.</p>
              </div>
              <div className="project-index-list">
                {experiments.map((project) => (
                  <ProjectIndexItem key={project.id} project={project} />
                ))}
              </div>
            </div>
          ) : (
            <div className="section-stack site-section">
              <div className="section-intro">
                <h2>Lab / Experiments</h2>
                <p>The archive is currently weighted toward larger projects. Smaller public experiments will show up here as they ship.</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState title="No projects match that filter." description="Change the selected status or publish another project from the admin area." />
      )}
    </section>
  );
}
