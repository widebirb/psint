import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/user";

export function useUser() {
    return useQuery({
        queryKey: ['user', 'me'],
        queryFn: userApi.getMe,
        staleTime: 1000 * 60 * 10,
    })
}