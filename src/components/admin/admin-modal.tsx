"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

export function AdminModal({
  label,
  closeHref,
  children,
}: {
  label: string;
  closeHref: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const closeModal = useCallback(() => {
    router.replace(closeHref, { scroll: false });
  }, [closeHref, router]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal]);

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <div className="modal-panel" role="dialog" aria-modal="true" aria-label={label}>
        <button type="button" className="modal-close" onClick={closeModal} aria-label="Close dialog">
          Close
        </button>
        {children}
      </div>
    </div>
  );
}
