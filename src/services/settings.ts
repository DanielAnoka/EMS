import { useQuery} from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";


export const useGetSettings =()=>{
    return useQuery({
        queryKey: ["settings"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/settings");
            return data;
        },
    });
}
