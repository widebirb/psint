import { useMemo } from "react"
import { useRecentJobs, useJobs } from "../hooks/useJobs"
import StatCard from "../components/StatCard"
import StatusBadge from "../components/StatusBadge"
import type { JobStatus } from "../types/job"
import { mockJobs } from "../mock/jobs"
import { CircleOff, ClipboardClock, Folder, SquareCheckBigIcon, SquareUserRound } from "lucide-react"
import s from './DashboardPage.module.css'

const ICON_SIZE = 30

function formatDate(dateStr: string | null) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export default function DashboardPage() {
    const { data: allJobsData } = useJobs({ page: 1, page_size: 200 })
    const { data: recentJobs, isLoading: recentLoading } = useRecentJobs()

    // mock data, remove after backend is finished
    const mockStats = useMemo(() => {
        const jobs = mockJobs ?? []
        const count = (st: JobStatus) => jobs.filter((j) => j.status === st).length
        return {
            total: mockJobs.length,
            applied: count('applied'),
            interviewing: count('interviewing'),
            offered: count('offered'),
            rejected: count('rejected'),
        }
    }, [])

    const stats = useMemo(() => {
        const jobs = allJobsData?.data ?? []
        const count = (st: JobStatus) => jobs.filter((j) => j.status === st).length
        return {
            total: jobs.length,
            applied: count('applied'),
            interviewing: count('interviewing'),
            offered: count('offered'),
            rejected: count('rejected'),
        }
    }, [allJobsData])

    return (
        <div className="page">
            <h1 className="page-title">Analytics</h1>
            <p className="page-subtitle">Overview of your job search.</p>

            <div className={s.grid}>
                <StatCard label="Total Tracked" value={mockStats.total} icon={<Folder size={ICON_SIZE} />} color="default" />
                <StatCard label="Applied" value={mockStats.applied} icon={<ClipboardClock size={ICON_SIZE} />} color="blue" />
                <StatCard label="Interviewing" value={mockStats.interviewing} icon={<SquareUserRound size={ICON_SIZE} />} color="yellow" />
                <StatCard label="Offers" value={mockStats.offered} icon={<SquareCheckBigIcon size={ICON_SIZE} />} color="green" />
                <StatCard label="Rejected" value={mockStats.rejected} icon={<CircleOff size={ICON_SIZE} />} color="red" />
            </div>

            {/* recent app */}
            <div className="section">
                <h2 className="section-title">Recent Application</h2>
                {recentLoading && <p className="muted">Loading...</p>}

                {!recentLoading && (!recentJobs || recentJobs.length === 0) && (
                    <p className="muted">No Applications yet.</p>
                )}

                {(
                    <div className={s.tableWrap}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Role</th>
                                    <th>Company</th>
                                    <th>Status</th>
                                    <th>Source</th>
                                    <th>Added</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockJobs.map((job) => (
                                    <tr key={job.id}>
                                        <td className="td-primary">{job.title}</td>
                                        <td>{job.company}</td>
                                        <td><StatusBadge status={job.status} /></td>
                                        <td className="muted capitalize">{job.source_site ?? ''}</td>
                                        <td className="muted">{formatDate(job.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
