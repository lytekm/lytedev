export const ANALYTICS_EXCLUSION_COOKIE = "lytedev_analytics_excluded";
export const ANALYTICS_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
export const ANALYTICS_RANGES = [7, 30, 90] as const;
export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number];

export function getAnalyticsRange(value: string | string[] | undefined): AnalyticsRange {
  const days = typeof value === "string" ? Number(value) : 30;
  return ANALYTICS_RANGES.includes(days as AnalyticsRange) ? days as AnalyticsRange : 30;
}

export function isPublicAnalyticsPath(path: string) {
  return path.length <= 512 && /^(?:\/|\/about|\/(?:projects|blog)(?:\/[a-z0-9-]+)?)$/.test(path);
}
