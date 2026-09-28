import type { Metadata } from "next";
import { PageViewTracker } from "@/components/site/page-view-tracker";
import Link from "next/link";
import Image from "next/image";
import { Markdown } from "@/components/site/markdown";
import { StatusBadge } from "@/components/site/status-badge";
import { absoluteUrl } from "@/lib/utils";
import { LOGO_PATH } from "@/lib/constants";
import { getAllProjectSlugs, requireProject } from "@/lib/content/queries";
import styles from "./page.module.css";

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
  const year = new Date(project.created_at).getFullYear();

  return (
    <article className={`shell page-section ${styles.page}`}>
      <PageViewTracker path={`/projects/${project.slug}`} />
      <Link href="/projects" className="back-link">
        {"<- Back to projects"}
      </Link>

      <div className={styles.hero}>
        <div className={styles.copy}>
          <p className="kicker">Project</p>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.lede}>{project.short_description}</p>
          <div className={styles.metaGrid}>
            <div>
              <span className={styles.label}>Status</span>
              <StatusBadge status={project.status} subtle />
            </div>
            <div>
              <span className={styles.label}>Year</span>
              <p>{year}</p>
            </div>
            <div>
              <span className={styles.label}>Technologies</span>
              <p>{project.technologies.join(" / ")}</p>
            </div>
          </div>
          <div className={styles.links}>
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

        <div className={styles.visual}>
          <span className={styles.visualDots} aria-hidden="true" />
          <Image
            src={project.image_url ?? LOGO_PATH}
            alt={`${project.title} visual`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, (max-width: 1288px) 60vw, 740px"
            className={!project.image_url || project.image_url === LOGO_PATH ? styles.logoImage : styles.image}
          />
        </div>
      </div>

      <div className={styles.contentWrap}>
        <Markdown content={project.content} />
      </div>
    </article>
  );
}
