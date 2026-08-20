import type { Metadata } from "next";
import { GITHUB_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: "About Kevin Morrison and the LyteDev umbrella.",
  alternates: {
    canonical: "/about",
  },
};

const sections = [
  {
    title: "About me",
    body: `I'm a software engineer who enjoys building things from the ground up and understanding how they work. 
    My professional experience is primarily in full-stack development, but I'm particularly interested in backend 
    systems, graphics programming, developer tooling, and game engine development.

    LyteDev is my home for those projects. Some are serious products, some are open-source tools, and some exist simply because I wanted to learn how something worked or didn't want to pay for an app I could build myself.`,
  },
  {
    title: "What I work with",
    body: `I primarily work with TypeScript, React, Next.js, Node.js, and MongoDB professionally. 
    Outside of work, I've been spending more time with C++, SDL, OpenGL, and GLSL while developing Lyte Engine.`,
  },
  {
    title: "What I'm interested in",
    body: `I'm especially interested in backend and systems engineering, graphics programming, game engine 
    architecture, developer tools, and finding simple solutions to problems that don't need complicated ones.`,
  },
];

export default function AboutPage() {
  return (
    <section className="shell page-section about-page">
      <div className="section-heading">
        <p className="eyebrow">About</p>
        <h1>Kevin Morrison</h1>
        <p className="muted">
          LyteDev is the public home for personal software engineering work,
          technical notes, experiments, and projects.
        </p>
      </div>

      <div className="about-grid">
        {sections.map((section) => (
          <article key={section.title} className="card about-card">
            <h2>{section.title}</h2>
            <p className="muted">{section.body}</p>
          </article>
        ))}
      </div>

      <div className="card about-links">
        <p className="eyebrow">GitHub</p>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          {GITHUB_URL}
        </a>
        <p className="eyebrow">LinkedIn</p>
        <a
          href="https://www.linkedin.com/in/kevin-r-morrison"
          target="_blank"
          rel="noreferrer"
        >
          www.linkedin.com/in/kevin-r-morrison
        </a>
        <p className="eyebrow">Email</p>
        <a href="mailto:kevin@lytedev.com">kevin@lytedev.com</a>
      </div>
    </section>
  );
}
