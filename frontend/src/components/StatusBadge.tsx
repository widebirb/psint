import type { JobStatus } from '../types/job'

const STATUS_CONFIG: Record<JobStatus, { label: string; className: string }> = {
    saved: { label: 'Saved', className: 'badge badge--saved' },
    applied: { label: 'Applied', className: 'badge badge--applied' },
    interviewing: { label: 'Interviewing', className: 'badge badge--interviewing' },
    offered: { label: 'Offered', className: 'badge badge--offered' },
    rejected: { label: 'Rejected', className: 'badge badge--rejected' },
}

export default function StatusBadge({ status }: { status: JobStatus }) {
    const config = STATUS_CONFIG[status]
    return <span className={config.className}>{config.label}</span>
}