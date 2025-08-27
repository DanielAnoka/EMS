import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";




export const useGetCharges = () => {
  return useQuery({
    queryKey: ["charges"],
    queryFn: async () => {
      const response = await axiosInstance.get("/charges");
      return response.data;
    },
  });
};