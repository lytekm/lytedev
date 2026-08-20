import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;

  return (
    <main className="admin-login shell page-section">
      <div className="admin-login__intro stack-md">
        <p className="eyebrow">Private admin</p>
        <h1>Sign in to manage LyteDev</h1>
        <p className="muted">
          Single-owner access only. Public registration is intentionally disabled; authorized administrator accounts must be created in Supabase.
        </p>
        {reason === "unauthorized" ? <p className="form-message form-message--error">This account is not on the administrator allow-list.</p> : null}
        <Link href="/" className="button">
          Back to site
        </Link>
      </div>

      <LoginForm />
    </main>
  );
}
