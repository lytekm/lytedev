import Link from "next/link";
import type { ProjectRow } from "@/lib/supabase/database.types";

function getProjectYear(project: ProjectRow) {
  return new Date(project.created_at).getFullYear();
}

export function ProjectIndexItem({ project }: { project: ProjectRow }) {
  return (
    <article className="project-index-item">
      <div className="project-index-item__main">
        <h3>
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>
        <p>{project.short_description}</p>
      </div>

      <div className="project-index-item__meta">
        <span>{project.technologies.slice(0, 3).join(" / ")}</span>
        <span>{project.status}</span>
        <span>{getProjectYear(project)}</span>
      </div>

      <Link href={`/projects/${project.slug}`} className="project-index-item__arrow" aria-label={`View ${project.title}`}>
        {"->"}
      </Link>
    </article>
  );
}
