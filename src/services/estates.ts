import { useMutation, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import type { CreateEstate, Estates } from "../types/estate";


type EstatesQueryOpts = Partial<UseQueryOptions<Estates[], Error>>;

export const useGetEstates = (opts?: EstatesQueryOpts) =>
  useQuery<Estates[], Error>({
    queryKey: ["estates"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Estates[]>("/estates");
      return data;
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
    ...opts,
  });

// export const useGetEstates = () => {
//   return useQuery({
//     queryKey: ["estates"],
//     queryFn: async () => {
//       const response = await axiosInstance.get("/estates");
//       return response.data;
//     },
//   });
// };

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
