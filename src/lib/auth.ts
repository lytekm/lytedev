import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export async function getAdminSession() {
  if (!hasSupabaseEnv()) {
    return { configured: false as const, user: null, isAdmin: false };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { configured: true as const, user: null, isAdmin: false };
  }

  const { data } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();

  return {
    configured: true as const,
    user,
    isAdmin: Boolean(data),
  };
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session.configured) {
    return session;
  }

  if (!session.user) {
    redirect("/admin/login");
  }

  if (!session.isAdmin) {
    redirect("/admin/login?reason=unauthorized");
  }

  return session;
}
