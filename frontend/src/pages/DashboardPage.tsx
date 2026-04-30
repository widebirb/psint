import { useState } from "react"
import { mockJobs, type Job, type JobStatus } from "../mock/jobs"
import './DashboardPage.css'


function DashboardPage() {
    const [jobs, setJobs] = useState<Job[]>(mockJobs)
    const total = mockJobs.length

    const STATUS_COLORS: Record<JobStatus, string> = {
        saved: '#e5e5e5',
        applied: '#bfdbfe',
        interviewing: '#fef08a',
        offered: '#bbf7d0',
        rejected: '#fecaca',
    }

    const STATUS_LABELS: Record<JobStatus, string> = {
        saved: 'Saved',
        applied: 'Applied',
        interviewing: 'Interviewing',
        offered: 'Offered',
        rejected: 'Rejected'
    }

    const countByStatus = (Object.keys(STATUS_LABELS) as JobStatus[]).map(status => ({
        status,
        label: STATUS_LABELS[status],
        count: mockJobs.filter(j => j.status === status).length,
        color: STATUS_COLORS[status],
    }))

    const countBySource = ['linkedin', 'indeed', 'jobstreet'].map(source => ({
        source,
        count: mockJobs.filter(j => j.source_site === source).length,
    }))

    return (
        <div className="dashboard">
            <main className="main-content">
                <div className="main-header">
                    <h1>My Applications</h1>
                </div>

                <div className="stat-cards">
                    <div className="stat-card">
                        <span className="stat-label">Total Applications</span>
                        <span className="stat-value">{total}</span>
                    </div>
                    {countByStatus.map(s => (
                        <div className="stat-card" key={s.status}>
                            <span className="stat-label">{s.label}</span>
                            <span className="stat-value">{s.count}</span>
                        </div>
                    ))}
                </div>


                <table className="jobs-table">
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Company</th>
                            <th>Location</th>
                            <th>Source</th>
                            <th>Date Posted</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job.id}>
                                <td>{job.title}</td>
                                <td>{job.company}</td>
                                <td>{job.location}</td>
                                <td className="source-site">{job.source_site}</td>
                                <td>{job.date_posted}</td>
                                <td>
                                    <span className={`status-badge status-${job.status}`}>
                                        {STATUS_LABELS[job.status]}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="analytics-sections">
                    <div className="analytics-card">
                        <h2>Applications by Status</h2>
                        <div className="bar-list">
                            {countByStatus.map(s => (
                                <div className="bar-row" key={s.status}>
                                    <span className="bar-label">{s.label}</span>
                                    <div className="bar-track">
                                        <div
                                            className="bar-fill"
                                            style={{
                                                width: total ? `${(s.count / total) * 100}%` : '0%',
                                                background: s.color,
                                            }}
                                        />
                                    </div>
                                    <span className="bar-count">{s.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="analytics-card">
                        <h2>Applications by Source</h2>
                        <div className="bar-list">
                            {countBySource.map(s => (
                                <div className="bar-row" key={s.source}>
                                    <span className="bar-label" style={{ textTransform: 'capitalize' }}>{s.source}</span>
                                    <div className="bar-track">
                                        <div
                                            className="bar-fill"
                                            style={{
                                                width: total ? `${(s.count / total) * 100}%` : '0%',
                                                background: '#111',
                                            }}
                                        />
                                    </div>
                                    <span className="bar-count">{s.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default DashboardPage