import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { ANALYTICS_EXCLUSION_COOKIE, isPublicAnalyticsPath } from "@/lib/analytics/shared";
import { isAnalyticsEnabled } from "@/lib/analytics/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const viewSchema = z.object({
  path: z.string().refine(isPublicAnalyticsPath),
  eventId: z.uuid(),
}).strict();

const bots = /bot|crawler|spider|slurp|headless|preview|lighthouse|facebookexternalhit/i;

function response(status = 204) {
  return new NextResponse(null, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!isAnalyticsEnabled() || !hasSupabaseEnv()) return response();
  if (request.cookies.get(ANALYTICS_EXCLUSION_COOKIE)?.value === "1") return response();
  if (request.headers.get("dnt") === "1" || request.headers.get("sec-gpc") === "1") return response();
  if (bots.test(request.headers.get("user-agent") ?? "")) return response();

  if (request.headers.get("origin") !== request.nextUrl.origin) return response(403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return response(415);
  if (Number(request.headers.get("content-length")) > 2048) return response(413);

  try {
    const body = await request.text();
    if (body.length > 2048) return response(413);
    const parsed = viewSchema.safeParse(JSON.parse(body));
    if (!parsed.success) return response(400);

    const supabase = await createSupabaseServerClient();
    // The RPC also excludes authenticated admins, including on other browsers.
    const { error } = await supabase.rpc("record_page_view", {
      p_path: parsed.data.path,
      p_event_id: parsed.data.eventId,
    });

    if (error) return response(503);
    return response();
  } catch (error) {
    return response(error instanceof SyntaxError ? 400 : 503);
  }
}
