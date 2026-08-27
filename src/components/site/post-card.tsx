import Link from "next/link";
import type { PostRow } from "@/lib/supabase/database.types";
import { calculateReadingTime, formatDate } from "@/lib/utils";

export function PostCard({ post }: { post: PostRow }) {
  return (
    <article className="post-row">
      <div className="post-row__date">{formatDate(post.published_at ?? post.created_at)}</div>
      <div className="post-row__body">
        <h3>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p>{post.excerpt}</p>
      </div>
      <div className="post-row__meta">
        <span>{post.tags[0] ?? "Notes"}</span>
        <span>{calculateReadingTime(post.content)}</span>
      </div>
      <Link href={`/blog/${post.slug}`} className="post-row__arrow" aria-label={`Read ${post.title}`}>
        {"->"}
      </Link>
    </article>
  );
}
