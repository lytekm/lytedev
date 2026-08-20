import Link from "next/link";
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

  const selectedPost = edit ? posts?.find((post) => post.id === edit) ?? null : create ? null : posts?.[0] ?? null;

  return (
    <section className="shell page-section admin-split">
      <div className="stack-md">
        <div className="admin-toolbar">
          <div>
            <p className="eyebrow">Blog posts</p>
            <h1>Manage posts</h1>
          </div>
          <Link href="/admin/posts?create=1" className="button button--primary">
            New post
          </Link>
        </div>

        <div className="list-panel">
          {posts?.map((post) => (
            <article key={post.id} className="card admin-list-item">
              <div className="stack-sm">
                <div className="card-meta">
                  {post.published ? <span className="chip chip--active">Published</span> : <span className="chip">Draft</span>}
                  <span>{formatDate(post.published_at ?? post.created_at)}</span>
                </div>
                <div>
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

      <PostForm post={selectedPost} />
    </section>
  );
}
