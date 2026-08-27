import Link from "next/link";
import Image from "next/image";
import type { ProjectRow } from "@/lib/supabase/database.types";
import { StatusBadge } from "@/components/site/status-badge";
import { cn } from "@/lib/utils";

function getProjectYear(project: ProjectRow) {
  return new Date(project.created_at).getFullYear();
}

export function ProjectCard({
  project,
  priority = false,
  index = 0,
}: {
  project: ProjectRow;
  priority?: boolean;
  index?: number;
}) {
  return (
    <article className={cn("project-feature", index % 2 === 1 && "project-feature--reverse")}>
      <div className="project-feature__copy">
        <div className="project-feature__topline">
          <h3>
            <Link href={`/projects/${project.slug}`}>{project.title}</Link>
          </h3>
          <span className="project-feature__index">{String(index + 1).padStart(2, "0")}</span>
        </div>

        <p className="project-feature__lede">{project.short_description}</p>

        <div className="project-feature__meta">
          <div>
            <span className="project-feature__label">Stack</span>
            <p>{project.technologies.join(" / ")}</p>
          </div>
          <div>
            <span className="project-feature__label">Status</span>
            <StatusBadge status={project.status} subtle />
          </div>
          <div>
            <span className="project-feature__label">Year</span>
            <p>{getProjectYear(project)}</p>
          </div>
        </div>

        <div className="project-feature__links">
          <Link href={`/projects/${project.slug}`}>View project</Link>
          {project.github_url ? (
            <a href={project.github_url} target="_blank" rel="noreferrer">
              GitHub
            </a>
          ) : null}
          {project.live_url ? (
            <a href={project.live_url} target="_blank" rel="noreferrer">
              Live
            </a>
          ) : null}
        </div>
      </div>

      <Link href={`/projects/${project.slug}`} className="project-feature__visual">
        <span className="project-feature__grid" aria-hidden="true" />
        <Image
          src={project.image_url ?? "/branding/lyte-logo.png"}
          alt={`${project.title} preview`}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 52vw"
          className="project-feature__image"
        />
      </Link>
    </article>
  );
}
