import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-frame">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
