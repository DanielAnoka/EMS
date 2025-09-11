import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import type { CreateNotification } from "../types/notifications";

export const useCreateCharge = () => {
  return useMutation({
    mutationFn: async (payload: CreateNotification) => {
      const response = await axiosInstance.post("/create/charge", payload);
      return response.data;
    },
  });
};
