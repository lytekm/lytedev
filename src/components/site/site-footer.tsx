import Link from "next/link";
import { GITHUB_URL, SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <div>
          <p className="eyebrow">{SITE_NAME}</p>
          <p className="muted">Personal software, tools, experiments, and engineering notes by Kevin Morrison.</p>
        </div>

        <div className="site-footer__links">
          <Link href="/projects">Projects</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
