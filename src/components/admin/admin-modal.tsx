"use client";

import { useCallback, useEffect, useRef } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  const closeModal = useCallback(() => {
    router.replace(closeHref, { scroll: false });
  }, [closeHref, router]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();

    return () => {
      document.body.style.overflow = previousOverflow;
      dialog?.close();
      previousFocus?.focus();
    };
  }, [closeModal]);

  return (
    <dialog
      ref={dialogRef}
      className="modal-backdrop"
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        closeModal();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <div className="modal-panel">
        <button type="button" className="modal-close" onClick={closeModal} aria-label="Close dialog">
          Close
        </button>
        {children}
      </div>
    </dialog>
  );
}
