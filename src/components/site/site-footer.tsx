import Link from "next/link";
import Image from "next/image";
import { GITHUB_URL, LOGO_PATH, SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <div className="site-footer__brand">
          <div className="site-footer__mark">
            <Image src={LOGO_PATH} alt="LyteDev logo" width={24} height={24} />
            <div>
              <p className="site-footer__title">{SITE_NAME}</p>
              <p className="site-footer__role">Kevin Morrison / Software Engineer</p>
            </div>
          </div>
          <p className="site-footer__copy">Things I’m building and notes on what I’m learning.</p>
        </div>

        <div className="site-footer__links">
          <Link href="/projects">Projects</Link>
          <Link href="/blog">Writing</Link>
          <Link href="/about">About</Link>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="mailto:kevin@lytedev.com">Email</a>
        </div>

        <p className="site-footer__legal">© 2026 LyteDev</p>
      </div>
    </footer>
  );
}
