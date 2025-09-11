import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trash,
} from "lucide-react";
import type { Notification } from "../../types/notifications";
import { timeAgo, truncate, normalize, cn } from "../../utils";
import { NotificationTypeBadge, RolePill } from "./NotificationTypeBadge";
import NotificationModal from "./NotificationModal";
import FiltersBar, { type NotificationFilters } from "./notificationsFilterBar";



interface NotificationsTableProps {
  notifications: Notification[];
  isLoading?: boolean;
  searchTerm: string;
  roles: string[];
  onDelete?: (n: Notification) => void;
  onMarkRead?: (n: Notification) => void | Promise<void>;

  pageSize?: number;
}

export function NotificationsTable({
  notifications,
  isLoading,
  searchTerm,
  roles,
  onDelete,
  onMarkRead,
  pageSize = 10,
}: NotificationsTableProps) {
  const [filters, setFilters] = useState<NotificationFilters>({ type: "all" });
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<Notification | null>(null);
  // Optimistic overlay: once opened, consider it read in UI
  const [readOverlay, setReadOverlay] = useState<Set<number>>(new Set());

  const isSuperOrAdmin =
    roles.includes("super admin") || roles.includes("admin");
  const isEstateAdmin = roles.includes("estate admin");
  const isEndUser = roles.includes("landlord") || roles.includes("tenant");

  const currentEndUserRole: "landlord" | "tenant" | null = roles.includes(
    "landlord"
  )
    ? "landlord"
    : roles.includes("tenant")
    ? "tenant"
    : null;

  const canSeeTypes = isEstateAdmin || isSuperOrAdmin;
  const canSeeAudience = isEstateAdmin;

  const statusColSpanClass = (() => {
    const remainder = 12 - 6 - (canSeeTypes ? 2 : 0) - (canSeeAudience ? 2 : 0);
    if (remainder === 2) return "col-span-2";
    if (remainder === 4) return "col-span-4";
    return "col-span-6";
  })();

  // Filtered list (role-aware + search + type)
  const filtered = useMemo(() => {
    let arr = [...(notifications || [])];

    if (isEndUser && currentEndUserRole) {
      arr = arr.filter((n) =>
        n.roles && n.roles.length ? n.roles.includes(currentEndUserRole) : true
      );
    }

    const q = normalize(searchTerm);
    if (q) {
      arr = arr.filter((n) => normalize(`${n.title} ${n.message}`).includes(q));
    }

    if (filters.type !== "all") {
      arr = arr.filter((n) => n.type === filters.type);
    }

    arr.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return arr;
  }, [notifications, searchTerm, filters, isEndUser, currentEndUserRole]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  );

  // Reset to first page on search/filter change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filters]);

  const handleOpenRow = async (n: Notification) => {
    setSelected(n);

    const alreadyRead = n.is_read === 1 || readOverlay.has(n.id);

    // Optimistically mark as read
    if (!alreadyRead) {
      setReadOverlay((prev) => new Set(prev).add(n.id));
      try {
        await onMarkRead?.(n);
      } catch {
        // If server call fails, roll back the optimistic read flag
        setReadOverlay((prev) => {
          const copy = new Set(prev);
          copy.delete(n.id);
          return copy;
        });
      }
    }
  };

  const effectiveIsRead = (n: Notification) =>
    n.is_read === 1 || readOverlay.has(n.id);

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              All Notifications
            </h3>
            <p className="text-xs text-slate-500">{filtered.length} total</p>
          </div>

          <FiltersBar
            value={filters}
            onChange={setFilters}
            showEstateColumn={isSuperOrAdmin}
          />
        </div>

        {/* Column header */}
        <div className="grid grid-cols-12 items-center gap-2 px-10 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <div className="col-span-6">Notification</div>
          {canSeeTypes && <div className="col-span-2">Type</div>}
          {canSeeAudience && <div className="col-span-2">Audience</div>}
          <div className={cn("text-right", statusColSpanClass)}>Status</div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Bell className="h-6 w-6 text-slate-500" />
            </div>
            <p className="font-medium text-slate-900">No notifications found</p>
            <p className="text-sm text-slate-500">
              Try adjusting filters or your search query.
            </p>
          </div>
        )}

        {/* Rows */}
        <div className="divide-y divide-slate-200 px-5">
          {pageData.map((n) => {
            const isRead = effectiveIsRead(n);

            return (
              <div
                key={n.id}
                role="button"
                tabIndex={0}
                onClick={() => handleOpenRow(n)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleOpenRow(n);
                }}
                className="grid grid-cols-12 gap-2 px-4 py-3 transition-colors hover:bg-slate-50/80 cursor-pointer focus:outline-none focus:bg-slate-50/80"
              >
                {/* Main */}
                <div className="col-span-6 flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-1 inline-block h-2.5 w-2.5 rounded-full",
                      isRead ? "bg-slate-300" : "bg-amber-500"
                    )}
                    title={isRead ? "Read" : "Unread"}
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={cn(
                          "truncate text-sm font-semibold",
                          isRead ? "text-slate-700" : "text-slate-900"
                        )}
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
                      className="mt-0.5 line-clamp-2 text-sm text-slate-600"
                      title={n.message}
                    >
                      {truncate(n.message, 140)}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                      <span title={new Date(n.created_at).toLocaleString()}>
                        {timeAgo(n.created_at)}
                      </span>

                      {n.url && (
                        <a
                          href={n.url}
                          className="inline-flex items-center gap-1 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open linked page"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> Open
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Type */}
                {canSeeTypes && (
                  <div className="col-span-2 flex items-center">
                    <NotificationTypeBadge type={n.type} />
                  </div>
                )}

                {/* Audience */}
                {canSeeAudience && (
                  <div className="col-span-2 flex items-center gap-1.5">
                    {n.roles && n.roles.length > 0 ? (
                      n.roles.map((r) => (
                        <RolePill key={`${n.id}-${r}`} role={r} />
                      ))
                    ) : (
                      <span className="text-[12px] text-slate-500">
                        All users
                      </span>
                    )}
                  </div>
                )}

                {/* Status / Actions */}
                <div
                  className={cn(
                    "flex items-center justify-end gap-2",
                    statusColSpanClass
                  )}
                  onClick={(e) => e.stopPropagation()} 
                >
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-red-600 hover:bg-red-50"
                    onClick={() => onDelete?.(n)}
                    title="Delete notification"
                    aria-label="Delete notification"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-xs text-slate-500">
              Page <span className="font-medium text-slate-700">{page}</span> of{" "}
              {pageCount}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page === pageCount}
                aria-label="Next page"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <NotificationModal
        open={!!selected}
        n={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}

export default NotificationsTable;
