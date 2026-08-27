"use server";

import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { uploadImage } from "@/lib/admin/media";
import { buildMarkdownImageSnippet } from "@/lib/markdown-images";

export type InlineImageState = {
  error: string;
  success: string;
  imageUrl: string;
  markdown: string;
};

const inlineImageSchema = z.object({
  alt: z.string().min(1, "Alt text is required."),
  title: z.string().optional(),
  folder: z.string().min(1),
});

export async function uploadInlineImageAction(_: InlineImageState, formData: FormData): Promise<InlineImageState> {
  const session = await requireAdmin();
  if (!session.configured) {
    return { error: "Supabase is not configured yet.", success: "", imageUrl: "", markdown: "" };
  }

  try {
    const parsed = inlineImageSchema.parse({
      alt: String(formData.get("alt") ?? "").trim(),
      title: String(formData.get("title") ?? "").trim(),
      folder: String(formData.get("folder") ?? "").trim(),
    });

    const imageFile = formData.get("image");
    if (!(imageFile instanceof File) || imageFile.size === 0) {
      return { error: "Choose an image to upload.", success: "", imageUrl: "", markdown: "" };
    }

    const uploaded = await uploadImage(imageFile, parsed.folder);

    if (!uploaded) {
      return { error: "Choose an image to upload.", success: "", imageUrl: "", markdown: "" };
    }

    return {
      error: "",
      success: "Image uploaded.",
      imageUrl: uploaded.publicUrl,
      markdown: buildMarkdownImageSnippet(uploaded.publicUrl, parsed.alt, parsed.title),
    };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, success: "", imageUrl: "", markdown: "" };
    }

    return { error: "Unable to upload image.", success: "", imageUrl: "", markdown: "" };
  }
}
