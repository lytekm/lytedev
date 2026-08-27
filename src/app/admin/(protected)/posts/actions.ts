"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { uploadImage } from "@/lib/admin/media";
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
      coverImageUrl = (await uploadImage(imageFile, "posts"))?.publicUrl ?? null;
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
