import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AnalyticsRange } from "./shared";

const count = z.number().int().nonnegative();
const reportSchema = z.object({
  total_views: count,
  today_views: count,
  pages_viewed: count,
  daily: z.array(z.object({ date: z.string(), views: count })),
  pages: z.array(z.object({
    path: z.string(),
    title: z.string(),
    views: count,
    first_viewed_at: z.string(),
    last_viewed_at: z.string(),
  })),
  recent: z.array(z.object({ path: z.string(), viewed_at: z.string() })),
});

export type AnalyticsReport = z.infer<typeof reportSchema>;
export type AnalyticsResult = {
  report: AnalyticsReport | null;
  error: "setup" | "unavailable" | null;
};

export function isAnalyticsEnabled() {
  if (process.env.ANALYTICS_ENABLED) return process.env.ANALYTICS_ENABLED === "true";
  return process.env.NODE_ENV === "production"
    && (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");
}

export async function getAnalyticsReport(days: AnalyticsRange): Promise<AnalyticsResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_page_view_report", { p_days: days });

    if (error) {
      return {
        report: null,
        error: ["PGRST202", "42P01", "42883"].includes(error.code) ? "setup" : "unavailable",
      };
    }

    const result = reportSchema.safeParse(data);
    return result.success
      ? { report: result.data, error: null }
      : { report: null, error: "unavailable" };
  } catch {
    return { report: null, error: "unavailable" };
  }
}
