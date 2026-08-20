import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";
import { hasSupabaseEnv, getSupabaseEnv } from "@/lib/supabase/env";

export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.searchParams.get("next") || "/admin";

  if (!hasSupabaseEnv()) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { url, anonKey } = getSupabaseEnv();
  const response = NextResponse.redirect(new URL(redirectTo, request.url));
  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  return response;
}
