"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { ANALYTICS_COOKIE_MAX_AGE, ANALYTICS_EXCLUSION_COOKIE } from "@/lib/analytics/shared";

export async function setAnalyticsExclusion(formData: FormData) {
  const session = await requireAdmin();
  if (!session.isAdmin) throw new Error("Admin access required.");

  const cookieStore = await cookies();
  cookieStore.set(ANALYTICS_EXCLUSION_COOKIE, formData.get("exclude") === "1" ? "1" : "0", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ANALYTICS_COOKIE_MAX_AGE,
  });
  revalidatePath("/admin");
}
