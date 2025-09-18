import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";
import type { CreatePropertyAttributePayload } from "../types/attribute";


export const useCreatePropertyAttribute = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (newAttribute: CreatePropertyAttributePayload) => {
      const response = await axiosInstance.post(
        "/property/attribute/create",
        newAttribute
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["property-attributes"] });
        toast.success(`Attribute "${variables.name}" created successfully!`);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create property attribute.";
      toast.error(message);
    },
  });
};

export const useGetAttribute = ()=>{
  return  useQuery(
    {
      queryKey: ["property-attributes"],
      queryFn: async () => {
        const response = await axiosInstance.get("/property/attributes");
        return response.data;
      },
    }
  )
}


