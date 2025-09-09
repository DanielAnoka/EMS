import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import type {  CreateChargePayload } from "../types/charges";

export const useGetCharges = () => {
  return useQuery({
    queryKey: ["charges"],
    queryFn: async () => {
      const response = await axiosInstance.get("/charges");
      return response.data;
    },
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
