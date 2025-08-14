import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";


export const useGetEstates = () => {
  return useQuery({
    queryKey: ["estates"],
    queryFn: async () => {
      const response = await axiosInstance.get("/estates");
      return response.data;
    },
  });
};
