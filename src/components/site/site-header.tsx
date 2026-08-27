"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { GITHUB_URL, LOGO_PATH, SITE_NAME } from "@/lib/constants";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link href="/" className="brand-mark" aria-label={`${SITE_NAME} home`}>
          <Image src={LOGO_PATH} alt="LyteDev logo" width={28} height={28} priority />
          <span className="brand-mark__wordmark">{SITE_NAME}</span>
        </Link>

        <nav className="main-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
