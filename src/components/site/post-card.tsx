import Link from "next/link";
import type { PostRow } from "@/lib/supabase/database.types";
import { calculateReadingTime, formatDate } from "@/lib/utils";

export function PostCard({ post }: { post: PostRow }) {
  return (
    <article className="card post-card">
      <div className="card-meta">
        <span>{formatDate(post.published_at ?? post.created_at)}</span>
        <span>{calculateReadingTime(post.content)}</span>
      </div>
      <div className="stack-sm">
        <h3>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="muted">{post.excerpt}</p>
      </div>
      <div className="tag-row">
        {post.tags.map((tag) => (
          <span key={tag} className="chip">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
