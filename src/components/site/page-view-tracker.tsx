"use client";

import { useEffect } from "react";

export function PageViewTracker({ path }: { path: string }) {
  useEffect(() => {
    if (navigator.doNotTrack === "1") return;

    let sent = false;
    const send = () => {
      if (sent || document.visibilityState !== "visible") return;
      sent = true;
      void fetch("/api/analytics", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, eventId: crypto.randomUUID() }),
        keepalive: true,
      }).catch(() => {
        // Analytics must never interrupt reading or navigation.
      });
    };

    // Cancel the first Strict Mode effect before sending; prefetched pages never
    // mount this effect. A fresh visit or reload creates a new event.
    const timer = window.setTimeout(send, 0);
    document.addEventListener("visibilitychange", send);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", send);
    };
  }, [path]);

  return null;
}
