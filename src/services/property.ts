import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance"; 
import type { Property } from "../types/property";



export const useGetProperties = () => {
  return useQuery<Property[]>({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await axiosInstance.get("estates/properties");
      return response.data as Property[];
    },
  });
};