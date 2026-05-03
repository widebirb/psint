import { apiClient } from "./client";

export interface UserProfile {
    id: string
    email: string
    name: string | null
    avatar_url: string | null
    created_at: string
}

export const userApi = {
    getMe: async (): Promise<UserProfile> => {
        const { data } = await apiClient.get('/me')
        return data
    }
}