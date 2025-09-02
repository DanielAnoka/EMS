import { useMutation, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import type { User } from "../types/auth";

// export const useGetUsers = () => {
//   return useQuery({
//     queryKey: ["users"],
//     queryFn: async () => {
//       const response = await axiosInstance.get("/users");
//       return response.data;
//     },
    
//   });
// };
type Users = User[];
type UsersQueryOpts = Partial<UseQueryOptions<Users, Error>>;

export const useGetUsers = (opts?: UsersQueryOpts) =>
  useQuery<Users, Error>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Users>("/users");
      return data;
    },
    staleTime: 60_000,    
    gcTime: 5 * 60_000,  
    retry: 1,         
    ...opts,              
  });

export const useEditUser = (userId: string) => {
  return useMutation({
    mutationFn: async (updatedData: Partial<User>) => {
      const response = await axiosInstance.put(`/users/${userId}`, updatedData);
      return response.data;
    },
  });
};


