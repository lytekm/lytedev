import type { Metadata } from "next";
import { PageViewTracker } from "@/components/site/page-view-tracker";
import Link from "next/link";
import { EmptyState } from "@/components/site/empty-state";
import { ProjectCard } from "@/components/site/project-card";
import { ProjectIndexItem } from "@/components/site/project-index-item";
import { filterProjectsByStatus, getProjectStatuses, getPublishedProjects } from "@/lib/content/queries";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Projects",
  description: "Apps, developer tools, and graphics experiments I’m building, with notes on how they work.",
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
  const experiments = projects.filter((project) => project.is_experiment || !project.featured);

  return (
    <section className={`shell page-section ${styles.page}`}>
      <PageViewTracker path="/projects" />
      <div className="page-intro">
        <p className="kicker">Projects</p>
        <h1>Project archive</h1>
        <p>Apps, tools, and experiments I’ve been working on, with notes on how they’re built and where they stand.</p>
      </div>

      <div className={styles.filters} aria-label="Project filters">
        {statuses.map((item) => {
          const active = (status ?? "All") === item;
          const href = item === "All" ? "/projects" : `/projects?status=${encodeURIComponent(item)}`;
          return (
            <Link key={item} href={href} aria-current={active ? "page" : undefined} className={active ? "filter-link filter-link--active" : "filter-link"}>
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
                <p>My larger projects, from the original idea to the implementation.</p>
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
                <p>Smaller builds, prototypes, and tools I made for myself or my team.</p>
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
                <p>No smaller projects to show{status && status !== "All" ? " for this status" : " yet"}. I’ll add them as they’re ready.</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState title="No projects to show." description="Try another status, or check back for new projects." />
      )}
    </section>
  );
}
