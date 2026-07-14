import { useMemo } from "react"
import { useRecentJobs, useJobs } from "../hooks/useJobs"
import StatCard from "../components/StatCard"
import StatusBadge from "../components/StatusBadge"
import type { JobStatus } from "../types/job"
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

    const stats = useMemo(() => {
        const jobs = allJobsData?.data ?? []
        const count = (s: JobStatus) => jobs.filter((j) => j.status === s).length
        return {
            total: jobs.length,
            applied: count('applied'),
            interviewing: count('interviewing'),
            offered: count('offered'),
            rejected: count('rejected'),
        }
    }, [allJobsData])
    return (
        <div className={s.page}>
            <h1 className={s.pageTitle}>Analytics</h1>
            <p className={s.pageSubtitle}>Overview of your job search.</p>

            <div className={s.grid}>
                <StatCard label="Total Tracked" value={stats.total} icon={<Folder size={ICON_SIZE} />} color="default" />
                <StatCard label="Applied" value={stats.applied} icon={<ClipboardClock size={ICON_SIZE} />} color="blue" />
                <StatCard label="Interviewing" value={stats.interviewing} icon={<SquareUserRound size={ICON_SIZE} />} color="yellow" />
                <StatCard label="Offers" value={stats.offered} icon={<SquareCheckBigIcon size={ICON_SIZE} />} color="green" />
                <StatCard label="Rejected" value={stats.rejected} icon={<CircleOff size={ICON_SIZE} />} color="red" />
            </div>

            {/* recent app */}
            <div className={s.section}>
                <h2 className={s.sectionTitle}>Recent Application</h2>
                {recentLoading && <p className={s.muted}>Loading...</p>}

                {!recentLoading && (!recentJobs || recentJobs.length === 0) && (
                    <p className={s.muted}>No Applications yet.</p>
                )}

                {recentJobs && recentJobs.length > 0 && (
                    <div className={s.tableWrap}>
                        <table className={s.table}>
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
                                {recentJobs.map((job) => (
                                    <tr key={job.id}>
                                        <td className={s.tdPrimary}>{job.title}</td>
                                        <td>{job.company}</td>
                                        <td><StatusBadge status={job.status} /></td>
                                        <td className={`${s.muted} ${s.capitalize}`}>{job.source_site ?? ''}</td>
                                        <td className={s.muted}>{formatDate(job.created_at)}</td>
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
