"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_SIZE, STORAGE_BUCKET } from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify, splitCommaList } from "@/lib/utils";

type FormState = { error: string; success: string };

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  slug: z.string().min(1),
  short_description: z.string().min(1),
  content: z.string().min(1),
  status: z.string().min(1),
  technologies: z.string().optional(),
  github_url: z.string().optional(),
  live_url: z.string().optional(),
  featured: z.boolean(),
  home_highlight: z.boolean(),
  is_experiment: z.boolean(),
  published: z.boolean(),
  sort_order: z.coerce.number().int().min(0),
  existingImageUrl: z.string().optional(),
});

async function uploadImage(file: File, folder: string) {
  if (!file.size) return null;
  if (file.size > MAX_UPLOAD_SIZE) throw new Error("Image exceeds the 5 MB limit.");
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    throw new Error("Unsupported image type.");
  }

  const supabase = await createSupabaseServerClient();
  const extension = file.name.split(".").pop() ?? "png";
  const path = `${folder}/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${extension}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, arrayBuffer, {
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function saveProjectAction(_: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();
  if (!session.configured) {
    return { error: "Supabase is not configured yet.", success: "" };
  }

  try {
    const parsed = projectSchema.parse({
      id: String(formData.get("id") ?? "") || undefined,
      title: String(formData.get("title") ?? "").trim(),
      slug: slugify(String(formData.get("slug") ?? "")),
      short_description: String(formData.get("short_description") ?? "").trim(),
      content: String(formData.get("content") ?? "").trim(),
      status: String(formData.get("status") ?? "").trim(),
      technologies: String(formData.get("technologies") ?? ""),
      github_url: String(formData.get("github_url") ?? "").trim(),
      live_url: String(formData.get("live_url") ?? "").trim(),
      featured: formData.get("featured") === "on",
      home_highlight: formData.get("home_highlight") === "on",
      is_experiment: formData.get("is_experiment") === "on",
      published: formData.get("published") === "on",
      sort_order: String(formData.get("sort_order") ?? "0"),
      existingImageUrl: String(formData.get("existingImageUrl") ?? "").trim(),
    });

    const supabase = await createSupabaseServerClient();
    const imageFile = formData.get("image");
    let imageUrl = parsed.existingImageUrl || null;

    if (imageFile instanceof File && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile, "projects");
    }

    const payload = {
      title: parsed.title,
      slug: parsed.slug,
      short_description: parsed.short_description,
      content: parsed.content,
      status: parsed.status,
      technologies: splitCommaList(parsed.technologies ?? ""),
      github_url: parsed.github_url || null,
      live_url: parsed.live_url || null,
      image_url: imageUrl,
      featured: parsed.featured,
      home_highlight: parsed.home_highlight,
      is_experiment: parsed.is_experiment,
      published: parsed.published,
      sort_order: parsed.sort_order,
    };

    const query = parsed.id
      ? supabase.from("projects").update(payload).eq("id", parsed.id)
      : supabase.from("projects").insert(payload);

    const { error } = await query;

    if (error) {
      return { error: error.message, success: "" };
    }

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return { error: "", success: parsed.id ? "Project updated." : "Project created." };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, success: "" };
    }

    return { error: "Unable to save project.", success: "" };
  }
}

export async function deleteProjectAction(formData: FormData) {
  const session = await requireAdmin();
  if (!session.configured) return;

  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();
  await supabase.from("projects").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}
