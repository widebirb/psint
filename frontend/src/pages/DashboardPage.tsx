import { useState } from "react"
import { mockJobs, type Job, type JobStatus } from "../mock/jobs"
import './DashboardPage.css'

const STATUS_LABELS: Record<JobStatus, string> = {
    saved: 'Saved',
    applied: 'Applied',
    interviewing: 'Interviewing',
    offered: 'Offered',
    rejected: 'Rejected'
}

function DashboardPage() {
    const [jobs, setJobs] = useState<Job[]>(mockJobs)

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <span className="logo">psint</span>
                <nav className="sidebar-nav">
                    <a href="/dashboard" className="nav-link active">Jobs</a>
                    <a href="/analytics" className="nav-link">Analytics</a>
                </nav>
            </aside>

            <main className="main-content">
                <div className="main-header">
                    <h1>My Applications</h1>
                    <button className="btn-primary">+ Add Job</button>
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
            </main>
        </div>
    )
}

export default DashboardPage