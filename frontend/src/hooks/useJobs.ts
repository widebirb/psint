import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { jobsApi } from "../api/jobs";
import type { JobsQueryParams } from "../types/pagination";
import type { CreateJobPayload, UpdateJobPayload } from "../types/job";

// query key factory
export const JOB_KEYS = {
    all: ['jobs'] as const,
    list: (params: JobsQueryParams) => ['jobs', 'list', params] as const,
    recent: () => ['jobs', 'recent'] as const,
}

export function useJobs(params: JobsQueryParams) {
    return useQuery({
        queryKey: JOB_KEYS.list(params),
        queryFn: () => jobsApi.getAll(params),
    })
}

export function useRecentJobs() {
    return useQuery({
        queryKey: JOB_KEYS.recent(),
        queryFn: () => jobsApi.getRecent(5),
    })
}

export function useCreateJob() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: CreateJobPayload) => jobsApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: JOB_KEYS.all })
            toast.success('Job saved!')
        },
        onError: () => {
            toast.error('Failed to save job. Please try again.')
        },
    })
}

export function useUpdateJob() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateJobPayload }) => jobsApi.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: JOB_KEYS.all })
            toast.success('Application updated!')
        },
        onError: () => {
            toast.error('Failed to update. Please try again.')
        },
    })
}

export function useDeleteJob() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id }: { id: string }) => jobsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: JOB_KEYS.all })
            toast.success('Applicaiton deleted')
        },
        onError: () => {
            toast.error('Failed to delete. Please try again.')
        }
    })
}
