import type { Metadata } from "next";
import { EmptyState } from "@/components/site/empty-state";
import { PostCard } from "@/components/site/post-card";
import { getPublishedPosts } from "@/lib/content/queries";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical writing published on LyteDev.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const postsByYear = Object.entries(
    posts.reduce<Record<string, typeof posts>>((acc, post) => {
      const year = String(new Date(post.published_at ?? post.created_at).getFullYear());
      acc[year] ??= [];
      acc[year].push(post);
      return acc;
    }, {}),
  ).sort((a, b) => Number(b[0]) - Number(a[0]));

  return (
    <section className={`shell page-section ${styles.page}`}>
      <div className="page-intro">
        <p className="kicker">Writing</p>
        <h1>Engineering notes and project writing.</h1>
        <p>A chronological publication index for technical posts, implementation notes, and smaller observations.</p>
      </div>

      {posts.length ? (
        <div className={styles.timeline}>
          {postsByYear.map(([year, yearPosts]) => (
            <section key={year} className={styles.yearGroup}>
              <h2 className={styles.year}>{year}</h2>
              <div className="post-list">
                {yearPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState title="No posts published yet." description="Publish a post from the admin area to populate the writing archive." />
      )}
    </section>
  );
}
