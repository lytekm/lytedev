import type { Metadata } from "next";
import { PageViewTracker } from "@/components/site/page-view-tracker";
import { GITHUB_URL } from "@/lib/constants";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description: "I’m Kevin Morrison, a software engineer building apps, developer tools, and graphics projects. LyteDev is where I share that work.",
  alternates: {
    canonical: "/about",
  },
};

const sections = [
  {
    label: "01",
    title: "What I do",
    body:
      "I build software for work and for myself. My personal projects usually start because I need a tool, want to try an idea, or want to understand something I haven’t worked with before.",
  },
  {
    label: "02",
    title: "What I work with",
    body:
      "Most of my day-to-day work is TypeScript, React, Next.js, and backend development. Outside of that, I spend time with C++, SDL, OpenGL, and GLSL. Graphics programming gives me a reason to work closer to the hardware and learn how the pieces actually work.",
  },
  {
    label: "03",
    title: "What I'm interested in",
    body:
      "I’m interested in backend systems, rendering, game engines, and developer tools. I like software that solves a specific problem well, and projects that make me work through something I don’t already know.",
  },
  {
    label: "04",
    title: "Why this site exists",
    body:
      "I wanted one place to keep my projects and write about the process. I share what I tried, what worked, and what didn’t. It’s useful to look back on, and hopefully useful to someone working through the same problems.",
  },
];

export default function AboutPage() {
  return (
    <section className={`shell page-section ${styles.page}`}>
      <PageViewTracker path="/about" />
      <div className={styles.heading}>
        <p className="kicker">About</p>
        <h1>Kevin Morrison</h1>
        <p>
          I’m a software engineer who likes making useful things and figuring out
          how they work. LyteDev is where I keep my personal projects and write
          about what I learn along the way.
        </p>
      </div>

      <div className={styles.grid}>
        {sections.map((section) => (
          <article key={section.title} className={styles.card}>
            <p className={styles.count}>{section.label}</p>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </div>

      <div className={styles.links}>
        <h2>Elsewhere</h2>
        <div className={styles.linkList}>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="mailto:kevin@lytedev.com">Email</a>
          <a href="https://lytedev.ca" target="_blank" rel="noreferrer">
            Website
          </a>
        </div>
      </div>
    </section>
  );
}
