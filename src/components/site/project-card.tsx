import Link from "next/link";
import Image from "next/image";
import type { ProjectRow } from "@/lib/supabase/database.types";
import { StatusBadge } from "@/components/site/status-badge";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, priority = false }: { project: ProjectRow; priority?: boolean }) {
  return (
    <article className={cn("card project-card", project.featured && "project-card--featured")}>
      <Link href={`/projects/${project.slug}`} className="project-card__visual">
        {project.featured ? <span className="project-card__dots" aria-hidden="true" /> : null}
        <Image
          src={project.image_url ?? "/branding/lyte-logo.png"}
          alt={`${project.title} preview`}
          fill
          priority={priority}
          sizes="(max-width: 900px) 100vw, 33vw"
          className="project-card__image"
        />
      </Link>

      <div className="project-card__body">
        <div className="card-meta">
          <StatusBadge status={project.status} />
          {project.featured ? <span className="chip">Featured</span> : null}
        </div>

        <div className="stack-sm">
          <h3>
            <Link href={`/projects/${project.slug}`}>{project.title}</Link>
          </h3>
          <p className="muted">{project.short_description}</p>
        </div>

        <div className="meta-row">
          <span>{project.technologies.join(" / ")}</span>
        </div>

        <div className="link-row">
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
    </article>
  );
}
