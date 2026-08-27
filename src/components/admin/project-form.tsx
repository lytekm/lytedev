"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import type { ProjectRow } from "@/lib/supabase/database.types";
import { joinList, slugify } from "@/lib/utils";
import { PROJECT_STATUSES } from "@/lib/constants";
import { saveProjectAction } from "@/app/admin/(protected)/projects/actions";
import { InlineImageUploader } from "@/components/admin/inline-image-uploader";
import { SubmitButton } from "@/components/admin/submit-button";

const initialState = { error: "", success: "" };

export function ProjectForm({ project, cancelHref }: { project?: ProjectRow | null; cancelHref?: string }) {
  const [state, action] = useActionState(saveProjectAction, initialState);
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project?.slug));
  const [content, setContent] = useState(project?.content ?? "");

  const suggestedSlug = useMemo(() => slugify(title), [title]);
  const displaySlug = slugTouched ? slug : suggestedSlug;

  function insertMarkdown(markdown: string) {
    setContent((current) => (current.trimEnd() ? `${current.trimEnd()}\n\n${markdown}` : markdown));
  }

  return (
    <form action={action} className="card admin-form stack-md">
      <input type="hidden" name="id" value={project?.id ?? ""} />
      <input type="hidden" name="existingImageUrl" value={project?.image_url ?? ""} />

      <div className="form-header">
        <div>
          <p className="eyebrow">Project editor</p>
          <h2>{project ? "Edit project" : "Create project"}</h2>
        </div>
      </div>

      <div className="field-grid">
        <label className="field field--wide">
          <span>Title</span>
          <input name="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
        </label>

        <label className="field">
          <span>Slug</span>
          <input
            name="slug"
            value={displaySlug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            required
          />
        </label>

        <label className="field">
          <span>Status</span>
          <select name="status" defaultValue={project?.status ?? "In Development"}>
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Display order</span>
          <input name="sort_order" type="number" min="0" defaultValue={project?.sort_order ?? 0} required />
        </label>
      </div>

      <p className="muted">Use Main projects section plus Display order for the larger `/projects` archive cards. Home page highlight and Experiments can be toggled independently.</p>

      <label className="field">
        <span>Short description</span>
        <textarea name="short_description" rows={3} defaultValue={project?.short_description ?? ""} required />
      </label>

      <label className="field">
        <span>Detailed content</span>
        <textarea name="content" rows={12} value={content} onChange={(event) => setContent(event.target.value)} required />
      </label>

      <InlineImageUploader
        folder="inline/projects"
        title="Inline project images"
        description="Upload diagrams, screenshots, or supporting visuals and insert the generated Markdown into the project description."
        onInsert={insertMarkdown}
      />

      <div className="field-grid">
        <label className="field field--wide">
          <span>Technologies</span>
          <input name="technologies" defaultValue={joinList(project?.technologies)} placeholder="TypeScript, Next.js, Supabase" />
        </label>
        <label className="field">
          <span>GitHub URL</span>
          <input name="github_url" type="url" defaultValue={project?.github_url ?? ""} />
        </label>
        <label className="field">
          <span>Live URL</span>
          <input name="live_url" type="url" defaultValue={project?.live_url ?? ""} />
        </label>
      </div>

      <div className="field-grid">
        <label className="field field--wide">
          <span>Project image upload</span>
          <input name="image" type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/gif" />
        </label>
        <label className="toggle">
          <input name="featured" type="checkbox" defaultChecked={project?.featured ?? false} />
          <span>Main projects section</span>
        </label>
        <label className="toggle">
          <input name="home_highlight" type="checkbox" defaultChecked={project?.home_highlight ?? false} />
          <span>Home page highlight</span>
        </label>
        <label className="toggle">
          <input name="is_experiment" type="checkbox" defaultChecked={project?.is_experiment ?? false} />
          <span>Experiments / smaller projects</span>
        </label>
        <label className="toggle">
          <input name="published" type="checkbox" defaultChecked={project?.published ?? true} />
          <span>Published</span>
        </label>
      </div>

      {state.error ? <p className="form-message form-message--error">{state.error}</p> : null}
      {state.success ? <p className="form-message form-message--success">{state.success}</p> : null}

      <div className="form-actions">
        {cancelHref ? (
          <Link href={cancelHref} className="button">
            Cancel
          </Link>
        ) : null}
        <SubmitButton label={project ? "Save project" : "Create project"} pendingLabel="Saving..." />
      </div>
    </form>
  );
}
