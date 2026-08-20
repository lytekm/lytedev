import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/site/empty-state";
import { ProjectCard } from "@/components/site/project-card";
import { SectionHeading } from "@/components/site/section-heading";
import { filterProjectsByStatus, getProjectStatuses, getPublishedProjects } from "@/lib/content/queries";

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

  return (
    <section className="shell page-section">
      <SectionHeading
        eyebrow="Projects"
        title="Project archive"
        description="A complete archive of published LyteDev projects, with lightweight status filtering and room for deeper technical write-ups on each entry."
      />

      <div className="filter-row" aria-label="Project filters">
        {statuses.map((item) => {
          const active = (status ?? "All") === item;
          const href = item === "All" ? "/projects" : `/projects?status=${encodeURIComponent(item)}`;
          return (
            <Link key={item} href={href} className={active ? "chip chip--active" : "chip"}>
              {item}
            </Link>
          );
        })}
      </div>

      {projects.length ? (
        <div className="card-grid card-grid--projects">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState title="No projects match that filter." description="Change the selected status or publish another project from the admin area." />
      )}
    </section>
  );
}
