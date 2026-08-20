import type { MetadataRoute } from "next";
import { getAllPostSlugs, getAllProjectSlugs } from "@/lib/content/queries";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, postSlugs] = await Promise.all([getAllProjectSlugs(), getAllPostSlugs()]);

  return [
    "",
    "/projects",
    "/blog",
    "/about",
    ...projectSlugs.map((slug) => `/projects/${slug}`),
    ...postSlugs.map((slug) => `/blog/${slug}`),
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
