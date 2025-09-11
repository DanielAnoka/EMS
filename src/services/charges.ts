import {
  useMutation,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import type { CreateChargePayload, Charge } from "../types/charges";

export const useGetCharges = (
  opts?: Partial<UseQueryOptions<Charge[], Error>>
) => {
  return useQuery<Charge[], Error>({
    queryKey: ["charges:all"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Charge[]>("/charges");
      return data;
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    ...opts,
  });
};

export const useGetChargesbyEstateId = (
  estateId: number,
  opts?: Partial<UseQueryOptions<Charge[], Error>>
) => {
  return useQuery<Charge[], Error>({
    queryKey: ["charges:by-estate", estateId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Charge[]>(
        `/estate/charges/${estateId}`
      );
      return data;
    },
    enabled: !!estateId,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    ...opts,
  });
};

export const useCreateCharge = () => {
  return useMutation({
    mutationFn: async (payload: CreateChargePayload) => {
      const response = await axiosInstance.post("/create/charge", payload);
      return response.data;
    },
  });
};
