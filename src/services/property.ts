import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import type { Property } from "../types/property";

// export const useGetProperties = () => {
//   return useQuery<Property[]>({
//     queryKey: ["properties"],
//     queryFn: async () => {
//       const response = await axiosInstance.get("estates/properties");
//       return response.data as Property[];
//     },
//   });
// };

type Properties = Property[];
type PropertiesQueryOpts = Partial<UseQueryOptions<Properties, Error>>;

export const useGetProperties = (opts?: PropertiesQueryOpts) =>
  useQuery<Properties, Error>({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Properties>(
        "/estates/properties"
      );
      return data;
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
    ...opts,
  });
