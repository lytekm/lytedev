import Link from "next/link";
import Image from "next/image";
import { ProjectCard } from "@/components/site/project-card";
import { PostCard } from "@/components/site/post-card";
import { ProjectIndexItem } from "@/components/site/project-index-item";
import { getPublishedProjects, getPublishedPosts } from "@/lib/content/queries";
import { GITHUB_URL, LOGO_PATH } from "@/lib/constants";
import styles from "./home.module.css";

export default async function HomePage() {
  const [projects, posts] = await Promise.all([
    getPublishedProjects(),
    getPublishedPosts(),
  ]);
  const highlightedProjects = projects
    .filter((project) => project.home_highlight)
    .slice(0, 3);
  const experiments = projects
    .filter((project) => project.is_experiment)
    .slice(0, 4);

  return (
    <div className="page-stack">
      <section className={`shell ${styles.hero}`}>
        <div className={styles.copy}>
          <p className="kicker">Kevin Morrison / Software Engineer</p>
          <h1 className={styles.title}>LyteDev</h1>
          <p className={styles.lede}>
            Personal engineering work spanning product ideas, graphics
            programming, developer tooling, and notes on how the pieces fit
            together.
          </p>
          <div className={styles.actions}>
            <Link href="/projects" className="text-link">
              Projects
            </Link>
            <Link href="/blog" className="text-link">
              Writing
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <span className={styles.visualDots} />
          <div className={styles.visualFrame}>
            <Image
              src={LOGO_PATH}
              alt=""
              width={320}
              height={320}
              priority
              className={styles.logo}
            />
          </div>
        </div>
      </section>

      <section className="shell section-stack site-section">
        <div className="section-intro">
          <p className="kicker">Selected Work</p>
          <h2>Projects</h2>
          <p>These are my larger standout projects.</p>
        </div>
        <div className="feature-stack">
          {highlightedProjects.length ? (
            highlightedProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                priority={index === 0}
                index={index}
              />
            ))
          ) : (
            <div className="empty-state">
              <h3>Highlights will show here.</h3>
              <p>Enable Home page highlight for any published project from the admin dashboard.</p>
            </div>
          )}
        </div>
      </section>

      <section className="shell section-stack site-section">
        <div className="section-intro section-intro--split">
          <div>
            <h2>Lab</h2>
            <p>
              Smaller utilities, prototypes, graphics experiments, and work that
              benefits from a lighter index.
            </p>
          </div>
          <Link href="/projects" className="text-link">
            View all projects
          </Link>
        </div>
        <div className="project-index-list">
          {experiments.length ? (
            experiments.map((project) => (
              <ProjectIndexItem key={project.id} project={project} />
            ))
          ) : (
            <div className="empty-state">
              <h3>Experiments will land here.</h3>
              <p>
                Smaller utilities, prototypes, and shorter engineering notes
                will expand the lab over time.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="shell section-stack site-section">
        <div className="section-intro section-intro--split">
          <div>
            <h2>Writing</h2>
            <p>
              Notes on projects, technical decisions, and the systems underneath
              the surface.
            </p>
          </div>
          <Link href="/blog" className="text-link">
            View all writing
          </Link>
        </div>
        <div className="post-list">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="shell section-stack section-stack--last site-section">
        <div className={styles.aboutPreview}>
          <div>
            <p className="kicker">About</p>
            <h2>
              Engineering work with a bias toward understanding the system
              underneath.
            </h2>
          </div>
          <div className={styles.aboutCopy}>
            <p>
              I am a software engineer who likes useful tools, graphics work,
              backend systems, and projects that teach me something concrete.
              LyteDev is the home for that work and the writing that comes with
              it.
            </p>
            <Link href="/about" className="text-link">
              More about me
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
