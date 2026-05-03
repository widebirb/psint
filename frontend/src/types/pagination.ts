export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    page_size: number
    total_pages: number
}

export interface JobsQueryParams {
    page?: number
    page_size?: number
    sort_by?: 'created_at' | 'date_posted' | 'company' | 'title' | 'status'
    sort_dir?: 'asc' | 'desc'
    status?: string
    source_site?: string
    search?: string
}