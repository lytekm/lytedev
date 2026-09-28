"use client";

import { useActionState, useId, useMemo, useState } from "react";
import Link from "next/link";
import type { PostRow } from "@/lib/supabase/database.types";
import { joinList, slugify } from "@/lib/utils";
import { InlineImageUploader } from "@/components/admin/inline-image-uploader";
import { savePostAction } from "@/app/admin/(protected)/posts/actions";
import { SubmitButton } from "@/components/admin/submit-button";
import { Markdown } from "@/components/site/markdown";

const initialState = { error: "", success: "" };

export function PostForm({ post, cancelHref }: { post?: PostRow | null; cancelHref?: string }) {
  const formId = useId();
  const [state, action] = useActionState(savePostAction, initialState);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [content, setContent] = useState(post?.content ?? "");

  const suggestedSlug = useMemo(() => slugify(title), [title]);
  const displaySlug = slugTouched ? slug : suggestedSlug;

  function insertMarkdown(markdown: string) {
    setContent((current) => (current.trimEnd() ? `${current.trimEnd()}\n\n${markdown}` : markdown));
  }

  return (
    <div className="card admin-form stack-md">
      <div className="form-header">
        <div>
          <p className="eyebrow">Post editor</p>
          <h2>{post ? "Edit post" : "Create post"}</h2>
        </div>
      </div>

      <div className="field-grid">
        <label className="field field--wide">
          <span>Title</span>
          <input form={formId} name="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
        </label>

        <label className="field">
          <span>Slug</span>
          <input
            form={formId}
            name="slug"
            value={displaySlug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            required
          />
        </label>
      </div>

      <label className="field">
        <span>Excerpt</span>
        <textarea form={formId} name="excerpt" rows={3} defaultValue={post?.excerpt ?? ""} required />
      </label>

      <div className="field-grid field-grid--two-column">
        <label className="field">
          <span>Markdown body</span>
          <textarea
            form={formId}
            name="content"
            rows={18}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
          />
        </label>

        <div className="field preview-panel">
          <span>Preview</span>
          <div className="preview-surface">
            <Markdown content={content || "# Preview\n\nStart writing to preview your Markdown."} />
          </div>
        </div>
      </div>

      <InlineImageUploader
        folder="inline/posts"
        title="Inline post images"
        description="Upload an image, then insert it into your post or copy its Markdown."
        onInsert={insertMarkdown}
      />

      <div className="field-grid">
        <label className="field field--wide">
          <span>Tags</span>
          <input form={formId} name="tags" defaultValue={joinList(post?.tags)} placeholder="engineering, graphics, tooling" />
        </label>
        <label className="field">
          <span>Publication date</span>
          <input
            form={formId}
            name="published_at"
            type="datetime-local"
            defaultValue={post?.published_at ? post.published_at.slice(0, 16) : ""}
          />
        </label>
      </div>

      <div className="field-grid">
        <label className="field field--wide">
          <span>Cover image upload</span>
          <input form={formId} name="image" type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/gif" />
        </label>
        <label className="toggle">
          <input form={formId} name="published" type="checkbox" defaultChecked={post?.published ?? true} />
          <span>Published</span>
        </label>
      </div>

      {state.error ? <p className="form-message form-message--error">{state.error}</p> : null}
      {state.success ? <p className="form-message form-message--success">{state.success}</p> : null}

      {/* Editor fields target this form so image uploads can use a separate form. */}
      <form id={formId} action={action} className="form-actions">
        <input type="hidden" name="id" value={post?.id ?? ""} />
        <input type="hidden" name="existingImageUrl" value={post?.cover_image_url ?? ""} />

        {cancelHref ? (
          <Link href={cancelHref} className="button">
            Cancel
          </Link>
        ) : null}
        <SubmitButton label={post ? "Save post" : "Create post"} pendingLabel="Saving..." />
      </form>
    </div>
  );
}
