"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_SIZE, STORAGE_BUCKET } from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify, splitCommaList } from "@/lib/utils";

type FormState = { error: string; success: string };

const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  tags: z.string().optional(),
  published: z.boolean(),
  published_at: z.string().optional(),
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

export async function savePostAction(_: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();
  if (!session.configured) {
    return { error: "Supabase is not configured yet.", success: "" };
  }

  try {
    const parsed = postSchema.parse({
      id: String(formData.get("id") ?? "") || undefined,
      title: String(formData.get("title") ?? "").trim(),
      slug: slugify(String(formData.get("slug") ?? "")),
      excerpt: String(formData.get("excerpt") ?? "").trim(),
      content: String(formData.get("content") ?? "").trim(),
      tags: String(formData.get("tags") ?? ""),
      published: formData.get("published") === "on",
      published_at: String(formData.get("published_at") ?? "").trim(),
      existingImageUrl: String(formData.get("existingImageUrl") ?? "").trim(),
    });

    const supabase = await createSupabaseServerClient();
    const imageFile = formData.get("image");
    let coverImageUrl = parsed.existingImageUrl || null;

    if (imageFile instanceof File && imageFile.size > 0) {
      coverImageUrl = await uploadImage(imageFile, "posts");
    }

    const payload = {
      title: parsed.title,
      slug: parsed.slug,
      excerpt: parsed.excerpt,
      content: parsed.content,
      tags: splitCommaList(parsed.tags ?? ""),
      cover_image_url: coverImageUrl,
      published: parsed.published,
      published_at: parsed.published ? parsed.published_at || new Date().toISOString() : null,
    };

    const query = parsed.id ? supabase.from("posts").update(payload).eq("id", parsed.id) : supabase.from("posts").insert(payload);
    const { error } = await query;

    if (error) {
      return { error: error.message, success: "" };
    }

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/posts");
    return { error: "", success: parsed.id ? "Post updated." : "Post created." };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, success: "" };
    }

    return { error: "Unable to save post.", success: "" };
  }
}

export async function deletePostAction(formData: FormData) {
  const session = await requireAdmin();
  if (!session.configured) return;

  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/posts");
}
