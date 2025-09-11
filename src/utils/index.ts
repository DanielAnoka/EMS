export const norm = (v: unknown) =>
  String(v ?? "")
    .toLowerCase()
    .trim();
export const statusText = (s: number) => (s === 1 ? "active" : "inactive");

export const toNum = (v: string | number | null | undefined) =>
  v === null || v === undefined
    ? NaN
    : typeof v === "number"
    ? v
    : Number(String(v).replace(/,/g, ""));

export const formatNaira = (v: number | string) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
    typeof v === "string" ? Number(v) : v
  );

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });


export  const cn = (...cls: (string | false | null | undefined)[]) => cls.filter(Boolean).join(" ");

 export const timeAgo = (iso: string) => {
  const now = new Date();
  const then = new Date(iso);
  const s = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return then.toLocaleDateString();
};

export const truncate = (str: string, n = 90) => (str.length > n ? str.slice(0, n - 1) + "…" : str);

export const normalize = (v?: string) => (v || "").toLowerCase();
