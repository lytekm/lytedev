"use client";

import { useActionState, useEffect, useRef } from "react";
import { uploadInlineImageAction, type InlineImageState } from "@/app/admin/(protected)/media/actions";
import { CopyButton } from "@/components/admin/copy-button";
import { SubmitButton } from "@/components/admin/submit-button";

const initialState: InlineImageState = {
  error: "",
  success: "",
  imageUrl: "",
  markdown: "",
};

export function InlineImageUploader({
  folder,
  title,
  description,
  onInsert,
}: {
  folder: string;
  title: string;
  description: string;
  onInsert?: (markdown: string) => void;
}) {
  const [state, action] = useActionState(uploadInlineImageAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div className="card stack-md inline-uploader">
      <div className="stack-sm">
        <h3>{title}</h3>
        <p className="muted">{description}</p>
      </div>

      <form ref={formRef} action={action} className="stack-md">
        <input type="hidden" name="folder" value={folder} />

        <div className="field-grid">
          <label className="field field--wide">
            <span>Image file</span>
            <input name="image" type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/gif" required />
          </label>
          <label className="field">
            <span>Alt text</span>
            <input name="alt" placeholder="What the image shows" required />
          </label>
          <label className="field">
            <span>Caption / title</span>
            <input name="title" placeholder="Optional caption" />
          </label>
        </div>

        <div className="form-actions">
          <SubmitButton label="Upload image" pendingLabel="Uploading..." />
        </div>
      </form>

      {state.error ? <p className="form-message form-message--error">{state.error}</p> : null}
      {state.success ? <p className="form-message form-message--success">{state.success}</p> : null}

      {state.imageUrl ? (
        <div className="stack-md inline-uploader__result">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={state.imageUrl} alt="Uploaded preview" className="inline-uploader__preview" />
          <label className="field">
            <span>Markdown snippet</span>
            <textarea value={state.markdown} readOnly rows={3} />
          </label>
          <div className="form-actions">
            <CopyButton value={state.markdown} label="Copy Markdown" />
            <CopyButton value={state.imageUrl} label="Copy URL" />
            {onInsert ? (
              <button type="button" className="button button--primary" onClick={() => onInsert(state.markdown)}>
                Insert into editor
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
