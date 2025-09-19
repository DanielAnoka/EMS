import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Show the bar even when totalPages === 1 (default: false) */
  showWhenSinglePage?: boolean;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showWhenSinglePage = false,
}: PaginationProps) {
  if (totalPages <= 1 && !showWhenSinglePage) return null;

  const page = currentPage;
  const pageCount = Math.max(1, totalPages);

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <p className="text-xs text-slate-500">
        Page <span className="font-medium text-slate-700">{page}</span> of {pageCount}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          disabled={page === pageCount}
          aria-label="Next page"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
