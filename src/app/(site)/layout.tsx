import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import "./site.css";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-frame">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <SiteFooter />
    </div>
  );
}
