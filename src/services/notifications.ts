import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import type { CreateNotification } from "../types/notifications";

export const useCreateNotification = () => {
  return useMutation({
    mutationFn: async (payload: CreateNotification) => {
      const response = await axiosInstance.post("notification/create", payload);
      return response.data;
    },
  });
};

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/notifications");
      return data;
    },
  });
};

export const useDeleteNotification = () => {
  return useMutation({
    mutationFn: async (notificationId: number | string) => {
      const response = await axiosInstance.delete(`/notification/delete/${notificationId}`);
      return response.data;
    },
  });
};



export const useUpdateNotification = () => {
  return useMutation({
    mutationFn: async ({
      notificationId,
      is_read,
    }: {
      notificationId: number;
      is_read: 0 | 1;
    }) => {
      const response = await axiosInstance.put(
        `/notification/update/${notificationId}`,
        { is_read } 
      );
      return response.data;
    },
  });
};