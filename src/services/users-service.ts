import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import type { User } from "../types/auth";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users");
      return response.data;
    },
  });
};

export const useEditUser = (userId: string) => {
  return useMutation({
    mutationFn: async (updatedData: Partial<User>) => {
      const response = await axiosInstance.put(`/users/${userId}`, updatedData);
      return response.data;
    },
  });
};
