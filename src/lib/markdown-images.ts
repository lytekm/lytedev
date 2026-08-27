export function buildMarkdownImageSnippet(url: string, alt: string, title?: string) {
  const safeAlt = alt.trim() || "Image";
  const safeTitle = title?.trim();

  if (safeTitle) {
    return `![${safeAlt}](${url} \"${safeTitle.replaceAll('"', '\\"')}\")`;
  }

  return `![${safeAlt}](${url})`;
}
