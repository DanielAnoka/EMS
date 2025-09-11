import { useMutation, useQuery} from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import type { CreateTenantPayload, TenantStatus } from "../types/tenant";

export const useCreateTenant = () => {
  return useMutation({
    mutationFn: async (newTenant: CreateTenantPayload) => {
      const response = await axiosInstance.post<TenantStatus>("/tenant/save", newTenant);
      return response.data; 
    },
  });
};

export const useGetTenants = () => {
  return useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const response = await axiosInstance.get("/tenants");
      return response.data;
    },
  });
};
