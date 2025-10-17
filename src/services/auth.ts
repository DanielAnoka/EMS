import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";
import { AxiosError } from "axios";
import type { CurrentUser } from "../types/auth";
import { storage } from "../utils/storage";

interface LoginPayload {
  email: string;
  password: string;
}

export type Role =
  | "admin"
  | "super admin"
  | "estate admin"
  | "landlord"
  | "tenant";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await axiosInstance.post("/login", payload);
      const { token, user, role } = response.data;
      return { token, user, role };
    },
    onSuccess: async (data) => {
      storage.setToken(data.token);
      queryClient.invalidateQueries({ queryKey: ["current_user"] });
      toast.success("Login successful");
    },
    onError: async (err) => {
      if (err instanceof AxiosError) {
        const msg =
          err.response?.data?.message || "An error occured, Please try again.";
        toast.error(msg);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await axiosInstance.post("/logout");
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ["current_user"] });
    },
    onSettled: () => {
      storage.removeToken();
    },
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["current_user"],
    queryFn: async (): Promise<CurrentUser | null> => {
      const token = storage.getToken();
      if (token) {
        const response = await axiosInstance.get("/me");
        return response.data;
      }
      return null;
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await axiosInstance.post("/register", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(`user created successfully!`);
    },
    onError: () => {
      toast.error("Failed to create user.");
    },
  });
};

export interface Statistics {
  payments_received: number;
  total_estates: number;
  total_properties: number;
  total_tenants: number;
  total_users: number;
}

type StatisticsQueryOpts = Partial<UseQueryOptions<Statistics, Error>>;

export const useGetStatistics = (opts?: StatisticsQueryOpts) =>
  useQuery<Statistics, Error>({
    queryKey: ["statistics"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Statistics>("/statistics");
      return data;
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
    ...opts,
  });

export interface EstateStatistics {
  payments_received: number;
  total_properties: number;
  total_tenants: number;
}

type EstateStatisticsQueryOpts = Partial<
  UseQueryOptions<EstateStatistics, Error>
>;

export const useGetEstateStatistics = (
  estateId: number,
  opts?: EstateStatisticsQueryOpts
) =>
  useQuery<EstateStatistics, Error>({
    queryKey: ["estate-statistics", estateId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<EstateStatistics>(
        `/estate/statistics/${estateId}`
      );
      return data;
    },
    enabled: !!estateId,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
    ...opts,
  });

export interface TenantStatistics {
  outstanding_charges: any[];
  total_amount_paid: number;
  total_payments: number;
}

type TenantStatisticsQueryOpts = Partial<
  UseQueryOptions<TenantStatistics, Error>
>;

export const useGetTenantStatistics = (
  tenantId: number,
  opts?: TenantStatisticsQueryOpts
) =>
  useQuery<TenantStatistics, Error>({
    queryKey: ["tenant-statistics", tenantId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<TenantStatistics>(
        `/tenant/statistics/${tenantId}`
      );
      return data;
    },
    enabled: !!tenantId,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
    ...opts,
  });
