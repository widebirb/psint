export type JobStatus = 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected'
export type JobSource = 'linkedin' | 'indeed' | 'jobstreet' | 'manual'

export interface Job {
    id: string
    user_id: string
    title: string
    company: string
    location: string | null
    job_type: string | null
    salary_range: string | null
    description_url: string | null
    source_site: JobSource | null
    date_posted: string | null
    status: JobStatus
    notes: string | null
    created_at: string
    update_at: string
}

export interface CreateJobPayload {
    title: string
    company: string
    location?: string
    job_type?: string
    salary_range?: string
    description_url?: string
    source_site?: JobSource
    date_posted?: string
    status?: JobStatus
    notes?: string
}

export interface UpdateJobPayload {
    status?: JobStatus
    notes?: string
    title?: string
    company?: string
    location?: string
    job_type?: string
    salary_range?: string
}