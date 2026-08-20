import Link from "next/link";
import Image from "next/image";
import { getFeaturedProjects, getPublishedPosts } from "@/lib/content/queries";
import { GITHUB_URL, LOGO_PATH } from "@/lib/constants";
import { ProjectCard } from "@/components/site/project-card";
import { PostCard } from "@/components/site/post-card";
import { SectionHeading } from "@/components/site/section-heading";
import styles from "./home.module.css";

export default async function HomePage() {
  const [projects, posts] = await Promise.all([
    getFeaturedProjects(),
    getPublishedPosts(),
  ]);

  return (
    <div className="page-stack">
      <section className={`shell ${styles.hero}`}>
        <div className={styles.copy}>
          <p className="eyebrow">LyteDev</p>
          <h1 className={styles.title}>
            Kevin Morrison
            <span className={styles.subtitle}>Software Engineer</span>
          </h1>
          <p className={styles.lede}>
            I build software, developer tools, applications, graphics and
            engine-adjacent technology, and the occasional deliberate
            experiment.
          </p>
          <div className="hero__actions">
            <Link href="/projects" className="button button--primary">
              Projects
            </Link>
            <Link href="/blog" className="button">
              Blog
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="button"
            >
              GitHub
            </a>
            <Link href="/about" className="button">
              About / Contact
            </Link>
          </div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.grid} />
          <Image
            src={LOGO_PATH}
            alt=""
            width={420}
            height={420}
            priority
            className={styles.logo}
          />
        </div>
      </section>

      <section className="shell section-stack">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Selected work"
          description="These are the projects that I am most proud of, and that I feel best represent my skills and experience. They are also the projects that I am currently working on, or that I have recently completed."
        />
        <div className="card-grid card-grid--projects">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              priority={index === 0}
            />
          ))}
        </div>
      </section>

      {/* <section className="shell section-stack">
        <SectionHeading
          eyebrow="Current / Featured Work"
          title="What LyteDev is set up to highlight"
          description="These are intentionally replaceable focus areas until the final project copy and supporting visuals are ready."
        />
        <div className="work-grid">
          {featuredWork.map((item) => (
            <article key={item.title} className="card work-card">
              <div className="card-meta">
                <span className="status-badge status-badge--subtle">
                  <span aria-hidden="true" className="status-badge__dot" />
                  {item.label}
                </span>
              </div>
              <h3>{item.title}</h3>
              <p className="muted">{item.description}</p>
            </article>
          ))}
        </div>
      </section> */}

      <section className="shell section-stack section-stack--last">
        <SectionHeading
          eyebrow="Latest Writing"
          title="Recent notes and posts"
          description="Checkout my blog posts for technical notes, experiments, and other things I find interesting. I also occasionally write about my personal experiences and thoughts on software engineering."
        />
        <div className="card-grid card-grid--posts">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
