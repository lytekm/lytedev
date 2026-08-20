import type { Metadata } from "next";
import Image from "next/image";
import { Markdown } from "@/components/site/markdown";
import { absoluteUrl, calculateReadingTime, formatDate } from "@/lib/utils";
import { getAllPostSlugs, requirePost } from "@/lib/content/queries";
import styles from "./page.module.css";

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await requirePost(slug);

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      images: post.cover_image_url ? [absoluteUrl(post.cover_image_url)] : undefined,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await requirePost(slug);

  return (
    <article className={`shell page-section ${styles.page}`}>
      <header className={styles.header}>
        <div className="card-meta">
          <span>{formatDate(post.published_at ?? post.created_at)}</span>
          <span>{calculateReadingTime(post.content)}</span>
        </div>
        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.lede}>{post.excerpt}</p>
        <div className="tag-row">
          {post.tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
        {post.cover_image_url ? (
          <div className={styles.cover}>
            <Image src={post.cover_image_url} alt={`${post.title} cover`} fill sizes="100vw" className="project-card__image" />
          </div>
        ) : null}
      </header>

      <Markdown content={post.content} />
    </article>
  );
}
