/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";

export type Payment = {
  id: number;
  amount: number;
  status: "pending" | "paid" | "failed" | string;
  charge_id?: number | null;
  property_id?: number | null;
  estate_id?: number | null;
  tenant_id?: number | null;
  created_at: string;
  updated_at?: string | null;
  [key: string]: any;
};

type Payments = Payment[];

const DEFAULTS = {
  staleTime: 60_000,
  gcTime: 5 * 60_000,
  retry: 1,
} as const;

type PaymentsQueryOpts = Partial<UseQueryOptions<Payments, Error>>;

export const paymentKeys = {
  all: () => ["payments", "all"] as const,
  byCharge: (chargeId: number | string) => ["payments", "charge", chargeId] as const,
  byProperty: (propertyId: number | string) => ["payments", "property", propertyId] as const,
  byEstate: (estateId: number | string) => ["payments", "estate", estateId] as const,
  byTenant: (tenantId: number | string) => ["payments", "tenant", tenantId] as const,
};

export const useGetAllPayments = (opts?: PaymentsQueryOpts) =>
  useQuery<Payments, Error>({
    queryKey: paymentKeys.all(),
    queryFn: async () => {
      const { data } = await axiosInstance.get<Payments>("/all/payments");
      return data;
    },
   
    ...DEFAULTS,
    ...opts,
  });

export const useGetChargePayments = (
  chargeId: number | string,
  opts?: PaymentsQueryOpts
) =>
  useQuery<Payments, Error>({
    queryKey: paymentKeys.byCharge(chargeId),
    queryFn: async () => {
      const { data } = await axiosInstance.get<Payments>(`/charge/payments/${chargeId}`);
      return data;
    },
    enabled: !!chargeId,
    ...DEFAULTS,
    ...opts,
  });

export const useGetPropertyPayments = (
  propertyId: number | string,
  opts?: PaymentsQueryOpts
) =>
  useQuery<Payments, Error>({
    queryKey: paymentKeys.byProperty(propertyId),
    queryFn: async () => {
      const { data } = await axiosInstance.get<Payments>(`/property/payments/${propertyId}`);
      return data;
    },
    enabled: !!propertyId,
    ...DEFAULTS,
    ...opts,
  });

export const useGetEstatePayments = (
  estateId: number | string,
  opts?: PaymentsQueryOpts
) =>
  useQuery<Payments, Error>({
    queryKey: paymentKeys.byEstate(estateId),
    queryFn: async () => {
      const { data } = await axiosInstance.get<Payments>(`/estate/payments/${estateId}`);
      return data;
    },
    enabled: !!estateId,
    ...DEFAULTS,
    ...opts,
  });

export const useGetTenantPayments = (
  tenantId: number | string,
  opts?: PaymentsQueryOpts
) =>
  useQuery<Payments, Error>({
    queryKey: paymentKeys.byTenant(tenantId),
    queryFn: async () => {
      const { data } = await axiosInstance.get<Payments>(`/tenant/payments/${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
    ...DEFAULTS,
    ...opts,
  });
