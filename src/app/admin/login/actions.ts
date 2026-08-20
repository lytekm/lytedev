"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

type AuthState = { error: string; success: string };

function getBaseUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) return siteUrl;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export async function loginWithPassword(_: AuthState, formData: FormData): Promise<AuthState> {
  if (!hasSupabaseEnv()) {
    return { error: "Supabase is not configured yet.", success: "" };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message, success: "" };
  }

  redirect("/admin");
}

export async function sendMagicLink(_: AuthState, formData: FormData): Promise<AuthState> {
  if (!hasSupabaseEnv()) {
    return { error: "Supabase is not configured yet.", success: "" };
  }

  const email = String(formData.get("email") ?? "").trim();
  const supabase = await createSupabaseServerClient();
  const headerList = await headers();
  const origin = headerList.get("origin") ?? getBaseUrl();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/admin`,
    },
  });

  if (error) {
    return { error: error.message, success: "" };
  }

  return { error: "", success: "Magic link sent. Check your email." };
}

export async function logout() {
  if (!hasSupabaseEnv()) {
    redirect("/admin/login");
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
