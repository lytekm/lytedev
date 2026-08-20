import Link from "next/link";
import { AdminModal } from "@/components/admin/admin-modal";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PostForm } from "@/components/admin/post-form";
import { deletePostAction } from "@/app/admin/(protected)/posts/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; create?: string }>;
}) {
  const { edit, create } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: posts } = await supabase.from("posts").select("*").order("published_at", { ascending: false, nullsFirst: false });

  const selectedPost = edit ? posts?.find((post) => post.id === edit) ?? null : null;
  const isModalOpen = Boolean(create || selectedPost);
  const totalPosts = posts?.length ?? 0;
  const publishedPosts = posts?.filter((post) => post.published).length ?? 0;

  return (
    <>
      <section className="shell page-section stack-lg">
        <div className="admin-toolbar">
          <div className="admin-page-head">
            <p className="eyebrow">Blog posts</p>
            <h1>Manage posts</h1>
            <p className="muted">Keep the writing archive clean, consistent, and ready to publish without leaving the admin workspace.</p>
          </div>
          <Link href="/admin/posts?create=1" className="button button--primary">
            New post
          </Link>
        </div>

        <div className="admin-summary-grid">
          <article className="card stat-card">
            <span className="eyebrow">Total posts</span>
            <strong>{totalPosts}</strong>
          </article>
          <article className="card stat-card">
            <span className="eyebrow">Published</span>
            <strong>{publishedPosts}</strong>
          </article>
        </div>

        <div className="list-panel">
          <div className="admin-list-header">
            <div>
              <p className="eyebrow">Library</p>
              <h2>All posts</h2>
            </div>
            <p className="muted">Select any entry to edit it in a focused modal without disrupting the list.</p>
          </div>

          <div className="admin-collection">
            {posts?.map((post) => (
              <article key={post.id} className="card admin-list-item">
                <div className="stack-sm">
                  <div className="card-meta">
                    {post.published ? <span className="chip chip--active">Published</span> : <span className="chip">Draft</span>}
                    <span>{formatDate(post.published_at ?? post.created_at)}</span>
                  </div>
                  <div className="stack-sm">
                    <h2>{post.title}</h2>
                    <p className="muted">{post.excerpt}</p>
                  </div>
                  <p className="meta-row">/{post.slug}</p>
                </div>

                <div className="admin-item-actions">
                  <Link href={`/admin/posts?edit=${post.id}`} className="button">
                    Edit
                  </Link>
                  <form action={deletePostAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <ConfirmButton label="Delete" message={`Delete ${post.title}? This cannot be undone.`} />
                  </form>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {isModalOpen ? (
        <AdminModal label={selectedPost ? `Edit ${selectedPost.title}` : "Create post"} closeHref="/admin/posts">
          <PostForm key={selectedPost?.id ?? "new-post"} post={selectedPost} cancelHref="/admin/posts" />
        </AdminModal>
      ) : null}
    </>
  );
}
