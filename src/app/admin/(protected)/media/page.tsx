import { createSupabaseServerClient } from "@/lib/supabase/server";
import { STORAGE_BUCKET } from "@/lib/constants";
import { MediaLibrary } from "@/components/admin/media-library";

async function getFolderAssets(folder: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).list(folder, {
    limit: 100,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error || !data) {
    return [];
  }

  return data
    .filter((item) => item.name)
    .map((item) => {
      const path = `${folder}/${item.name}`;
      const { data: publicUrl } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);

      return {
        name: item.name,
        path,
        url: publicUrl.publicUrl,
        createdAt: item.created_at ?? null,
      };
    });
}

export default async function AdminMediaPage() {
  const supabase = await createSupabaseServerClient();
  const [{ data: projects }, { data: posts }, projectInlineAssets, postInlineAssets] = await Promise.all([
    supabase.from("projects").select("id, title, image_url").order("updated_at", { ascending: false }),
    supabase.from("posts").select("id, title, cover_image_url").order("updated_at", { ascending: false }),
    getFolderAssets("inline/projects"),
    getFolderAssets("inline/posts"),
  ]);
  const inlineAssets = [...projectInlineAssets, ...postInlineAssets].sort((a, b) => {
    return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
  });

  return (
    <section className="shell page-section stack-lg">
      <div className="section-heading">
        <p className="eyebrow">Media</p>
        <h1>Media library</h1>
        <p className="muted">Images uploaded from your project and post editors. Copy a URL or Markdown snippet to reuse an image.</p>
      </div>

      <div className="card stack-md">
        <h2>Inline images</h2>
        <p className="muted">Screenshots and other images used in your writing.</p>
        {inlineAssets.length ? <MediaLibrary assets={inlineAssets} /> : <p className="muted">Upload an inline image in a post or project editor to see it here.</p>}
      </div>

      <div className="admin-card-grid">
        <div className="card stack-md">
          <h2>Project images</h2>
          <div className="stack-sm">
            {projects?.map((project) => (
              <p key={project.id} className="muted">
                <strong>{project.title}</strong>: {project.image_url ?? "No image"}
              </p>
            ))}
          </div>
        </div>

        <div className="card stack-md">
          <h2>Post cover images</h2>
          <div className="stack-sm">
            {posts?.map((post) => (
              <p key={post.id} className="muted">
                <strong>{post.title}</strong>: {post.cover_image_url ?? "No image"}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
