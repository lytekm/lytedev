import type { Metadata } from "next";
import { EmptyState } from "@/components/site/empty-state";
import { PostCard } from "@/components/site/post-card";
import { SectionHeading } from "@/components/site/section-heading";
import { getPublishedPosts } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical writing published on LyteDev.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <section className="shell page-section">
      <SectionHeading
        eyebrow="Blog"
        title="Writing archive"
        description="Markdown articles, notes, and technical posts published through the private admin area."
      />

      {posts.length ? (
        <div className="card-grid card-grid--posts">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState title="No posts published yet." description="Publish a post from the admin area to populate the writing archive." />
      )}
    </section>
  );
}
