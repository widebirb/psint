import { mockJobs, JobStatus } from '../mock/jobs'
import './AnalyticsPage.css'

const STATUS_LABELS: Record<JobStatus, string> = {
    saved: 'Saved',
    applied: 'Applied',
    interviewing: 'Interviewing',
    offered: 'Offered',
    rejected: 'Rejected',
}

const STATUS_COLORS: Record<JobStatus, string> = {
    saved: '#e5e5e5',
    applied: '#bfdbfe',
    interviewing: '#fef08a',
    offered: '#bbf7d0',
    rejected: '#fecaca',
}

function AnalyticsPage() {
    const total = mockJobs.length

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
            <aside className="sidebar">
                <span className="logo">psint</span>
                <nav className="sidebar-nav">
                    <a href="/dashboard" className="nav-link">Jobs</a>
                    <a href="/analytics" className="nav-link active">Analytics</a>
                </nav>
            </aside>

            <main className="main-content">
                <div className="main-header">
                    <h1>Analytics</h1>
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

export default AnalyticsPage