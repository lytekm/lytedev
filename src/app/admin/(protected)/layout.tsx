import Link from "next/link";
import { logout } from "@/app/admin/login/actions";
import { requireAdmin } from "@/lib/auth";
import styles from "./layout.module.css";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  if (!session.configured) {
    return (
      <main className={`shell page-section ${styles.setup}`}>
        <div className="card stack-md">
          <p className="eyebrow">Admin setup</p>
          <h1>Supabase configuration required</h1>
          <p className="muted">
            The public site can render local seed content without Supabase, but the private admin area requires the Supabase environment variables and database schema described in the README.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className={styles.shell}>
      <header className="admin-header">
        <div className="shell admin-header__inner">
          <Link href="/admin" className="brand-mark">
            <span>LyteDev Admin</span>
          </Link>

          <nav className="main-nav" aria-label="Admin navigation">
            <Link href="/admin/projects">Projects</Link>
            <Link href="/admin/posts">Blog Posts</Link>
            <Link href="/admin/media">Media</Link>
            <form action={logout}>
              <button type="submit" className="button">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
