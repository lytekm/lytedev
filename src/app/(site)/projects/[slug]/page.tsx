import type { Metadata } from "next";
import Image from "next/image";
import { Markdown } from "@/components/site/markdown";
import { StatusBadge } from "@/components/site/status-badge";
import { absoluteUrl } from "@/lib/utils";
import { getAllProjectSlugs, requireProject } from "@/lib/content/queries";

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await requireProject(slug);

  return {
    title: project.title,
    description: project.short_description,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.short_description,
      url: `/projects/${project.slug}`,
      images: project.image_url ? [absoluteUrl(project.image_url)] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await requireProject(slug);

  return (
    <article className="shell page-section detail-page">
      <div className="detail-hero">
        <div className="detail-hero__copy">
          <div className="card-meta">
            <StatusBadge status={project.status} />
            {project.featured ? <span className="chip">Featured</span> : null}
          </div>
          <h1>{project.title}</h1>
          <p className="detail-hero__lede">{project.short_description}</p>
          <div className="tag-row">
            {project.technologies.map((technology) => (
              <span key={technology} className="chip">
                {technology}
              </span>
            ))}
          </div>
          <div className="link-row">
            {project.github_url ? (
              <a href={project.github_url} target="_blank" rel="noreferrer">
                GitHub
              </a>
            ) : null}
            {project.live_url ? (
              <a href={project.live_url} target="_blank" rel="noreferrer">
                Live site
              </a>
            ) : null}
          </div>
        </div>

        <div className="detail-hero__visual">
          <Image
            src={project.image_url ?? "/branding/lyte-logo.png"}
            alt={`${project.title} visual`}
            fill
            sizes="(max-width: 900px) 100vw, 42vw"
            className="project-card__image"
          />
        </div>
      </div>

      <Markdown content={project.content} />
    </article>
  );
}
