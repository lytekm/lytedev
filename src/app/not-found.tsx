import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell page-section">
      <div className="card stack-md">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="muted">The page you requested does not exist, or the content has not been published yet.</p>
        <div className="hero__actions">
          <Link href="/" className="button button--primary">
            Home
          </Link>
          <Link href="/projects" className="button">
            Projects
          </Link>
          <Link href="/blog" className="button">
            Blog
          </Link>
        </div>
      </div>
    </main>
  );
}
