import { cache } from "react";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { seedPosts, seedProjects } from "@/lib/content/seed";
import type { PostRow, ProjectRow } from "@/lib/supabase/database.types";

async function tryGetSupabaseClient() {
  if (!hasSupabaseEnv()) return null;

  try {
    return await createSupabaseServerClient();
  } catch {
    return null;
  }
}

export const getPublishedProjects = cache(async () => {
  const supabase = await tryGetSupabaseClient();

  if (!supabase) {
    return [...seedProjects].sort((a, b) => a.sort_order - b.sort_order);
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error || !data) {
    return [...seedProjects].sort((a, b) => a.sort_order - b.sort_order);
  }

  return data;
});

export const getPublishedPosts = cache(async () => {
  const supabase = await tryGetSupabaseClient();

  if (!supabase) {
    return [...seedPosts].sort(
      (a, b) => new Date(b.published_at ?? b.created_at).getTime() - new Date(a.published_at ?? a.created_at).getTime(),
    );
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [...seedPosts].sort(
      (a, b) => new Date(b.published_at ?? b.created_at).getTime() - new Date(a.published_at ?? a.created_at).getTime(),
    );
  }

  return data;
});

export async function getFeaturedProjects() {
  const projects = await getPublishedProjects();
  return projects.filter((project) => project.featured).slice(0, 3);
}

export async function getProjectBySlug(slug: string) {
  const projects = await getPublishedProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function getPostBySlug(slug: string) {
  const posts = await getPublishedPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getAllProjectSlugs() {
  const projects = await getPublishedProjects();
  return projects.map((project) => project.slug);
}

export async function getAllPostSlugs() {
  const posts = await getPublishedPosts();
  return posts.map((post) => post.slug);
}

export async function requireProject(slug: string) {
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  return project;
}

export async function requirePost(slug: string) {
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  return post;
}

export async function filterProjectsByStatus(status?: string) {
  const projects = await getPublishedProjects();
  if (!status || status === "All") return projects;
  return projects.filter((project) => project.status === status);
}

export function getProjectStatuses(projects: ProjectRow[]) {
  return ["All", ...new Set(projects.map((project) => project.status))];
}

export function getPostTags(posts: PostRow[]) {
  return [...new Set(posts.flatMap((post) => post.tags))].sort();
}
