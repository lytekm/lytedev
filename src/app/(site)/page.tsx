import Link from "next/link";
import Image from "next/image";
import { ProjectCard } from "@/components/site/project-card";
import { PageViewTracker } from "@/components/site/page-view-tracker";
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
      <PageViewTracker path="/" />
      <section className={`shell ${styles.hero}`}>
        <div className={styles.copy}>
          <p className="kicker">Kevin Morrison / Software Engineer</p>
          <h1 className={styles.title}>LyteDev</h1>
          <p className={styles.lede}>
            I build apps, tools, and graphics projects. This is where I share
            what I’m working on and what I’m learning.
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
          <p>The projects I’ve spent the most time building.</p>
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
              <h3>Project write-ups are on the way.</h3>
              <p>I’ll share the details here when they’re ready.</p>
            </div>
          )}
        </div>
      </section>

      <section className="shell section-stack site-section">
        <div className="section-intro section-intro--split">
          <div>
            <h2>Lab</h2>
            <p>
              Smaller tools and experiments, usually built to solve a problem
              or try something new.
            </p>
          </div>
          <Link href="/projects" className="text-link">
            Projects
          </Link>
        </div>
        <div className="project-index-list">
          {experiments.length ? (
            experiments.map((project) => (
              <ProjectIndexItem key={project.id} project={project} />
            ))
          ) : (
            <div className="empty-state">
              <h3>More experiments to come.</h3>
              <p>
                I’ll add smaller projects here as I have something to share.
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
              What I’ve been building, the decisions behind it, and what I’d do
              differently next time.
            </p>
          </div>
          <Link href="/blog" className="text-link">
            Writing
          </Link>
        </div>
        <div className="post-list">
          {posts.length ? posts.slice(0, 3).map((post) => (
            <PostCard key={post.id} post={post} />
          )) : (
            <div className="empty-state">
              <h3>No posts yet.</h3>
              <p>I’ll share project updates and notes here.</p>
            </div>
          )}
        </div>
      </section>

      <section className="shell section-stack section-stack--last site-section">
        <div className={styles.aboutPreview}>
          <div>
            <p className="kicker">About</p>
            <h2>
              I learn by building things.
            </h2>
          </div>
          <div className={styles.aboutCopy}>
            <p>
              I’m a software engineer, and a lot of my personal time goes into
              building more software. Sometimes it’s a tool I need. Other times,
              I just want to understand how something works.
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
