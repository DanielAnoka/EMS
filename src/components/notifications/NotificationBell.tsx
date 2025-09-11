import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, ExternalLink, Loader2 } from "lucide-react";
import {
  useGetNotifications,
  useUpdateNotification,
} from "../../services/notifications";
import type { Notification } from "../../types/notifications";
import { timeAgo, truncate, cn } from "../../utils";
import { Link } from "react-router-dom";

type NotificationBellProps = {
  limit?: number;

  allHref?: string;
};

export default function NotificationBell({
  limit = 2,
  allHref = "/notifications",
}: NotificationBellProps) {
  const { data: notifications = [], isLoading } = useGetNotifications();
  const { mutateAsync: updateNotification } = useUpdateNotification();

  const [open, setOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [optimisticRead, setOptimisticRead] = useState<Set<number>>(new Set());

  // Derived
  const sorted = useMemo(
    () =>
      [...notifications].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [notifications]
  );

  const unreadCount = useMemo(
    () =>
      sorted.reduce(
        (acc, n) =>
          acc + (n.is_read === 0 && !optimisticRead.has(n.id) ? 1 : 0),
        0
      ),
    [sorted, optimisticRead]
  );

  const recent = useMemo(() => sorted.slice(0, limit), [sorted, limit]);

  // Close on outside click / ESC
  useEffect(() => {
    if (!open) return;

    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !bellRef.current?.contains(t)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleItemClick = async (n: Notification) => {
    // Optimistic mark-as-read
    if (n.is_read === 0 && !optimisticRead.has(n.id)) {
      setOptimisticRead((prev) => new Set(prev).add(n.id));
      try {
        await updateNotification({ notificationId: n.id, is_read: 1 });
      } catch {
        setOptimisticRead((prev) => {
          const cp = new Set(prev);
          cp.delete(n.id);
          return cp;
        });
      }
    }
    // follow URL if present
    if (n.url) {
      window.open(n.url, "_blank", "noopener,noreferrer");
    }
  };

  const badgeContent =
    unreadCount > 99 ? "99+" : unreadCount > 9 ? "9+" : String(unreadCount);

  return (
    <div className="relative">
      <button
        ref={bellRef}
        onClick={() => setOpen((s) => !s)}
        className={cn(
          "p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative",
          open && "bg-gray-100 text-gray-900"
        )}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 grid place-items-center
                       rounded-full bg-red-600 text-white text-[10px] font-semibold
                       border-2 border-white"
          >
            {badgeContent}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute right-0 mt-2 w-[360px] max-w-[90vw] rounded-xl border border-gray-200 bg-white shadow-xl z-50"
        >
          <div className="px-3 py-2 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">Notifications</p>
            <p className="text-xs text-gray-500">
              {unreadCount} unread • {notifications.length} total
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : recent.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              Nothing new right now.
            </div>
          ) : (
            <ul className="max-h-[360px] overflow-auto">
              {recent.map((n) => {
                const isRead = n.is_read === 1 || optimisticRead.has(n.id);
                return (
                  <li
                    key={n.id}
                    className="px-3 py-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleItemClick(n)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        handleItemClick(n);
                    }}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          "mt-1 inline-block h-2.5 w-2.5 rounded-full flex-shrink-0",
                          isRead ? "bg-gray-300" : "bg-amber-500"
                        )}
                        title={isRead ? "Read" : "Unread"}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={cn(
                              "truncate text-sm font-medium",
                              isRead ? "text-gray-700" : "text-gray-900"
                            )}
                            title={n.title}
                          >
                            {n.title}
                          </p>
                          {!isRead && (
                            <span className="text-[10px] font-semibold uppercase text-amber-600">
                              New
                            </span>
                          )}
                        </div>
                        <p
                          className="mt-0.5 text-sm text-gray-600 line-clamp-2"
                          title={n.message}
                        >
                          {truncate(n.message, 120)}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
                          <span title={new Date(n.created_at).toLocaleString()}>
                            {timeAgo(n.created_at)}
                          </span>
                          {n.url && (
                            <span className="inline-flex items-center gap-1">
                              <ExternalLink className="h-3.5 w-3.5" />
                              Open
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="px-3 py-2 border-t border-gray-200 flex items-center justify-between">
            <Link
              to={allHref}
              className="text-sm font-medium text-blue-700 hover:underline"
              onClick={() => setOpen(false)}
            >
              View all notifications
            </Link>
            <button
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
