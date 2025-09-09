export interface Charge {
  id: number;
  name: string;
  amount: number;
  duration: number;
  estate_id: number;
  property_type_id: number | null;
  status: number;
  user_id: number;
  created_at: string;
}

export interface CreateChargePayload {
  name: string;
  amount: number;
  duration: number;
  estate_id: number | null;
  property_type_id: number | null;
  status: number;
  user_id: number;
}

export type DurationType = "monthly" | "yearly" | "one_time";

export const DURATION_MAP: Record<DurationType, number> = {
  monthly: 1,
  yearly: 12,
  one_time: 2,
};

export const DURATION_LABELS: Record<DurationType, string> = {
  monthly: "Monthly",
  yearly: "Yearly",
  one_time: "One Time Fee",
};

export const getDurationLabel = (duration: number): string => {
  const entry = Object.entries(DURATION_MAP).find(
    ([, value]) => value === duration
  );
  if (!entry) return `${duration} months`; // fallback
  return DURATION_LABELS[entry[0] as DurationType];
};
