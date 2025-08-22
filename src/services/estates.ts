import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import type { CreateEstate } from "../types/estate";


export const useGetEstates = () => {
  return useQuery({
    queryKey: ["estates"],
    queryFn: async () => {
      const response = await axiosInstance.get("/estates");
      return response.data;
    },
  });
};

export const useCreateEstate = () => {
  return useMutation({
    mutationFn: async (payload: CreateEstate) => {
      const response = await axiosInstance.post("/estate/save", payload);
      return response.data;
    },
  });
};

export const useGetEstateById = (estateId: string) => {
  return useQuery({
    queryKey: ["estate", estateId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/estate/${estateId}`);
      return response.data;
    },
  });
}
