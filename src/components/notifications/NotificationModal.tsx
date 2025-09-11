import { useEffect, useRef } from "react";
import { ExternalLink, X } from "lucide-react";
import { createPortal } from "react-dom";

import type { Notification } from "../../types/notifications";
import { timeAgo } from "../../utils";
import { NotificationTypeBadge, RolePill } from "./NotificationTypeBadge";

type NotificationModalProps = {
  open: boolean;
  onClose: () => void;
  n: Notification | null;
};

export default function NotificationModal({ open, onClose, n }: NotificationModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Basic focus handling & body scroll lock
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // focus the close button when open
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open || !n) return null;

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-0 md:p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        className="w-full md:max-w-xl rounded-t-2xl md:rounded-2xl bg-white shadow-xl ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-3">
          <div className="min-w-0">
            <h4 className="text-base font-semibold text-slate-900 truncate">
              {n.title}
            </h4>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <span title={new Date(n.created_at).toLocaleString()}>
                {timeAgo(n.created_at)}
              </span>
              <NotificationTypeBadge type={n.type} />
              {n.roles?.length ? (
                <div className="flex gap-1">
                  {n.roles.map((r) => (
                    <RolePill key={`${n.id}-${r}`} role={r} />
                  ))}
                </div>
              ) : (
                <span className="text-slate-500">All users</span>
              )}
            </div>
          </div>

          <button
            ref={closeBtnRef}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-4">
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-800">
            {n.message}
          </p>

          {n.url && (
            <a
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Open link
            </a>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
          <button
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Render via portal to avoid stacking/context issues
  return createPortal(modal, document.body);
}
