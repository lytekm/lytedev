import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_SIZE, STORAGE_BUCKET } from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function uploadImage(file: File, folder: string) {
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

  return {
    path,
    publicUrl: data.publicUrl,
  };
}
