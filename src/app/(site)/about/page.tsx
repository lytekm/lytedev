import type { Metadata } from "next";
import { GITHUB_URL } from "@/lib/constants";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description: "About Kevin Morrison and the LyteDev umbrella.",
  alternates: {
    canonical: "/about",
  },
};

const sections = [
  {
    label: "01",
    title: "What I do",
    body:
      "I build software professionally and spend a lot of my personal time building more of it for myself. Most of that work lives somewhere between product engineering, tooling, and the kind of technical experiments that start with a question and turn into a real project.",
  },
  {
    label: "02",
    title: "What I work with",
    body:
      "A lot of my day-to-day work is TypeScript, React, Next.js, and backend application development. Outside of work I keep returning to C++, SDL, OpenGL, GLSL, and graphics-oriented systems because I like understanding what the abstractions are built on top of.",
  },
  {
    label: "03",
    title: "What I'm interested in",
    body:
      "I am interested in backend and systems engineering, rendering, game engine architecture, developer tools, and practical software that solves a narrow problem well. I also like documenting the work clearly enough that the next version of me can pick it back up.",
  },
  {
    label: "04",
    title: "Elsewhere",
    body:
      "LyteDev is the home for personal software, experiments, and technical writing. If something is public, there is a good chance it eventually ends up here with a write-up, a screenshot, or at least a note on what I learned building it.",
  },
];

export default function AboutPage() {
  return (
    <section className={`shell page-section ${styles.page}`}>
      <div className={styles.heading}>
        <p className="kicker">About</p>
        <h1>Kevin Morrison</h1>
        <p>
          I am a software engineer who likes building useful things and understanding the systems underneath them. LyteDev is where I keep the personal side of that work.
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
