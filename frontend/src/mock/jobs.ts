export type JobStatus = 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected'

export interface Job {
    id: string
    title: string
    company: string
    location: string
    job_type: string
    salary_range: string
    source_site: string
    date_posted: string
    status: JobStatus
    notes: string
    created_at: string
}

export const mockJobs: Job[] = [
    {
        id: '1',
        title: 'Frontend Developer',
        company: 'Acme Corp',
        location: 'Remote',
        job_type: 'Full-time',
        salary_range: '₱80,000–₱120,000',
        source_site: 'linkedin',
        date_posted: '2026-04-20',
        status: 'applied',
        notes: 'Referral from a friend',
        created_at: '2026-04-21',
    },
    {
        id: '2',
        title: 'React Engineer',
        company: 'Bright Labs',
        location: 'Makati, PH',
        job_type: 'Full-time',
        salary_range: '₱90,000–₱130,000',
        source_site: 'jobstreet',
        date_posted: '2026-04-18',
        status: 'interviewing',
        notes: '',
        created_at: '2026-04-19',
    },
    {
        id: '3',
        title: 'UI Engineer',
        company: 'Patch Systems',
        location: 'Taguig, PH',
        job_type: 'Contract',
        salary_range: '₱70,000–₱90,000',
        source_site: 'indeed',
        date_posted: '2026-04-15',
        status: 'saved',
        notes: 'Interesting stack',
        created_at: '2026-04-16',
    },
    {
        id: '4',
        title: 'Software Engineer',
        company: 'NovaTech',
        location: 'Remote',
        job_type: 'Full-time',
        salary_range: '₱100,000–₱150,000',
        source_site: 'linkedin',
        date_posted: '2026-04-10',
        status: 'rejected',
        notes: 'Did not pass initial screening',
        created_at: '2026-04-11',
    },
    {
        id: '5',
        title: 'Junior Frontend Dev',
        company: 'Seedling Co',
        location: 'BGC, PH',
        job_type: 'Full-time',
        salary_range: '₱50,000–₱70,000',
        source_site: 'jobstreet',
        date_posted: '2026-04-22',
        status: 'offered',
        notes: 'Offer letter received',
        created_at: '2026-04-23',
    },
]