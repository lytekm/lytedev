import type { Metadata } from "next";
import { PageViewTracker } from "@/components/site/page-view-tracker";
import { EmptyState } from "@/components/site/empty-state";
import { PostCard } from "@/components/site/post-card";
import { getPublishedPosts } from "@/lib/content/queries";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on what I’m building, what I’m learning, and the decisions behind my projects.",
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
      <PageViewTracker path="/blog" />
      <div className="page-intro">
        <p className="kicker">Writing</p>
        <h1>Notes from my projects.</h1>
        <p>What I’m working on, what I’ve learned, and the problems I’ve run into along the way.</p>
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
        <EmptyState title="No posts yet." description="I’ll share project updates and notes here when they’re ready." />
      )}
    </section>
  );
}
