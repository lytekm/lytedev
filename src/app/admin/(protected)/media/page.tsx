import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminMediaPage() {
  const supabase = await createSupabaseServerClient();
  const [{ data: projects }, { data: posts }] = await Promise.all([
    supabase.from("projects").select("id, title, image_url").order("updated_at", { ascending: false }),
    supabase.from("posts").select("id, title, cover_image_url").order("updated_at", { ascending: false }),
  ]);

  return (
    <section className="shell page-section stack-lg">
      <div className="section-heading">
        <p className="eyebrow">Media</p>
        <h1>Storage references</h1>
        <p className="muted">Images are uploaded through the project and post editors into the shared Supabase Storage bucket.</p>
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
