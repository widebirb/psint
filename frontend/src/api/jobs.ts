import { apiClient } from './client'
import type { Job, CreateJobPayload, UpdateJobPayload } from '../types/job'
import type { PaginatedResponse, JobsQueryParams } from "../types/pagination"

export const jobsApi = {
    getAll: async (params: JobsQueryParams): Promise<PaginatedResponse<Job>> => {
        const { data } = await apiClient.get('/jobs', { params })
        return data
    },

    getRecent: async (limit = 5): Promise<Job[]> => {
        const { data } = await apiClient.get('/jobs', {
            params: { page: 1, page_size: limit, sort_by: 'created_at', sort_dir: 'desc' }
        })
        return data.data
    },

    create: async (payload: CreateJobPayload): Promise<Job> => {
        const { data } = await apiClient.post('/jobs', payload)
        return data
    },

    update: async (id: string, payload: UpdateJobPayload): Promise<Job> => {
        const { data } = await apiClient.patch(`/jobs/${id}`, payload)
        return data
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/jobs/${id}`)
    }

}

