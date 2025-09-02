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
