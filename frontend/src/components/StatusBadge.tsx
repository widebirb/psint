import type { JobStatus } from '../types/job'
import s from './StatusBadge.module.css'

const STATUS_CONFIG: Record<JobStatus, { label: string; styleKey: keyof typeof s }> = {
    saved:        { label: 'Saved',        styleKey: 'saved' },
    applied:      { label: 'Applied',      styleKey: 'applied' },
    interviewing: { label: 'Interviewing', styleKey: 'interviewing' },
    offered:      { label: 'Offered',      styleKey: 'offered' },
    rejected:     { label: 'Rejected',     styleKey: 'rejected' },
}

export default function StatusBadge({ status }: { status: JobStatus }) {
    const config = STATUS_CONFIG[status]
    return <span className={`${s.badge} ${s[config.styleKey]}`}>{config.label}</span>
}