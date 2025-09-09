import {
  useMutation,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import type { CreateProperty, Property } from "../types/property";

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

export const useGetPropertyById = (id: number) =>
  useQuery<Property, Error>({
    queryKey: ["properties", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Property>(
        `/estate/property/${id}`
      );
      return data;
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });

export const useCreateProperty = () => {
  return useMutation({
    mutationFn: async (payload: CreateProperty) => {
      const response = await axiosInstance.post("/estates/property", payload);
      return response.data;
    },
  });
};
