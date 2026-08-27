"use client";

import { useState } from "react";

export function CopyButton({ value, label = "Copy", copiedLabel = "Copied" }: { value: string; label?: string; copiedLabel?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" className="button" onClick={handleCopy} disabled={!value}>
      {copied ? copiedLabel : label}
    </button>
  );
}
