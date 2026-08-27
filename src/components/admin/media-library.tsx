"use client";

import { CopyButton } from "@/components/admin/copy-button";
import { buildMarkdownImageSnippet } from "@/lib/markdown-images";

type MediaAsset = {
  name: string;
  path: string;
  url: string;
  createdAt: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "Unknown date";

  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function buildAltText(name: string) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim() || "Image";
}

export function MediaLibrary({ assets }: { assets: MediaAsset[] }) {
  return (
    <div className="media-grid">
      {assets.map((asset) => {
        const markdown = buildMarkdownImageSnippet(asset.url, buildAltText(asset.name));

        return (
          <article key={asset.path} className="card stack-sm media-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset.url} alt={asset.name} className="media-card__preview" />
            <div className="stack-sm">
              <p className="eyebrow">{asset.path}</p>
              <p className="muted">{formatDate(asset.createdAt)}</p>
            </div>
            <div className="form-actions">
              <CopyButton value={markdown} label="Copy Markdown" />
              <CopyButton value={asset.url} label="Copy URL" />
            </div>
          </article>
        );
      })}
    </div>
  );
}
