import { useState, useCallback } from 'react'
import { useJobs, useUpdateJob, useDeleteJob } from '../hooks/useJobs'
import JobFormModal from '../components/JobFormModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import type { Job, JobStatus } from '../types/job'
import type { JobsQueryParams } from '../types/pagination'
import { mockJobs } from "../mock/jobs"
import { ArrowLeft, ArrowRight, MoveDown, MoveUp, MoveVertical, Plus, SquarePen, Trash } from "lucide-react"
import s from './ApplicationsPage.module.css'

const PAGE_SIZE = 10
const ICON_SIZE_SM = 15
const ICON_SIZE_MD = 18
const ICON_SIZE_LG = 20

type SortBy = JobsQueryParams['sort_by']
type SortDir = 'asc' | 'desc'

function formatDate(dateStr: string | null) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-PH', {
        month: 'short', day: 'numeric', year: 'numeric',
    })
}

export default function ApplicationsPage() {
    // query state
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [status, setStatus] = useState('')
    const [sourceSite, setSourceSite] = useState('')
    const [sortBy, setSortBy] = useState<SortBy>('created_at')
    const [sortDir, setSortDir] = useState<SortDir>('desc')

    // modal state
    const [formOpen, setFormOpen] = useState(false)
    const [editJob, setEditJob] = useState<Job | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Job | null>(null)

    const params: JobsQueryParams = {
        page,
        page_size: PAGE_SIZE,
        sort_by: sortBy,
        sort_dir: sortDir,
        ...(search && { search }),
        ...(status && { status }),
        ...(sourceSite && { source_site: sourceSite }),
    }

    const { data, isLoading } = useJobs(params)
    const updateJob = useUpdateJob()
    const deleteJob = useDeleteJob()

    const jobs = data?.data ?? []
    const totalPages = data?.total_pages ?? 1
    const total = data?.total ?? 0

    const handleSort = (col: SortBy) => {
        if (sortBy === col) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortBy(col)
            setSortDir('asc')
        }
        setPage(1)
    }

    const sortIcon = (col: SortBy) => {
        if (sortBy !== col) return <span className={s.sortIcon}><MoveVertical size={ICON_SIZE_SM} /></span>
        return (
            <span className={`${s.sortIcon} ${s.sortIconActive}`}>
                {sortDir === 'asc' ? <MoveUp size={ICON_SIZE_SM} /> : <MoveDown size={ICON_SIZE_SM} />}
            </span>
        )
    }

    const commitSearch = useCallback(() => {
        setSearch(searchInput)
        setPage(1)
    }, [searchInput])

    const handleStatusChange = (job: Job, newStatus: JobStatus) => {
        updateJob.mutate({ id: job.id, payload: { status: newStatus } })
    }

    const handleEdit = (job: Job) => {
        setEditJob(job)
        setFormOpen(true)
    }

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return
        deleteJob.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Applications</h1>
                    <p className="page-subtitle">
                        {total > 0 ? `${total} application${total !== 1 ? 's' : ''} tracked` : 'No applications yet.'}
                    </p>
                </div>
                <button className="btn btn--primary btn--with-icon" onClick={() => { setEditJob(null); setFormOpen(true) }}>
                    <Plus size={ICON_SIZE_MD} />Add Application
                </button>
            </div>

            {/* filters */}
            <div className={s.filters}>
                <div className={s.searchWrap}>
                    <input
                        className={s.searchInput}
                        placeholder="Search role or company..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && commitSearch()}
                    />
                    <button className="btn btn--ghost" onClick={commitSearch}>Search</button>
                </div>

                <select
                    className={s.filterSelect}
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); setPage(1) }}
                >
                    <option value="">All Statuses</option>
                    <option value="saved">Saved</option>
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offered">Offered</option>
                    <option value="rejected">Rejected</option>
                </select>

                <select
                    className={s.filterSelect}
                    value={sourceSite}
                    onChange={(e) => { setSourceSite(e.target.value); setPage(1) }}
                >
                    <option value="">All Sources</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="indeed">Indeed</option>
                    <option value="jobstreet">JobStreet</option>
                    <option value="manual">Manual</option>
                </select>

                {(search || status || sourceSite) && (
                    <button
                        className="btn btn--ghost"
                        onClick={() => {
                            setSearch(''); setSearchInput(''); setStatus(''); setSourceSite(''); setPage(1)
                        }}
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* table */}
            <div className={s.tableWrap}>
                <table className="table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('title')} className={s.thSortable}>
                                <span className={s.thContent}>Role {sortIcon('title')}</span>
                            </th>
                            <th onClick={() => handleSort('company')} className={s.thSortable}>
                                <span className={s.thContent}>Company {sortIcon('company')}</span>
                            </th>
                            <th>Location</th>
                            <th onClick={() => handleSort('status')} className={s.thSortable}>
                                <span className={s.thContent}>Status {sortIcon('status')}</span>
                            </th>
                            <th>Source</th>
                            <th onClick={() => handleSort('date_posted')} className={s.thSortable}>
                                <span className={s.thContent}>Posted {sortIcon('date_posted')}</span>
                            </th>
                            <th onClick={() => handleSort('created_at')} className={s.thSortable}>
                                <span className={s.thContent}>Added {sortIcon('created_at')}</span>
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan={8} className="table-empty">Loading...</td>
                            </tr>
                        )}
                        {!isLoading && jobs.length === 0 && (
                            <tr>
                                <td colSpan={8} className="table-empty">No applications found.</td>
                            </tr>
                        )}
                        {mockJobs.map((job) => (
                            <tr key={job.id}>
                                <td className="td-primary">
                                    {job.description_url
                                        ? <a href={job.description_url} target="_blank" rel="noreferrer" className={s.jobLink}>{job.title}</a>
                                        : job.title
                                    }
                                </td>
                                <td>{job.company}</td>
                                <td className="muted">{job.location ?? '—'}</td>
                                <td>
                                    <select
                                        className={s.statusSelect}
                                        value={job.status}
                                        onChange={(e) => handleStatusChange(job, e.target.value as JobStatus)}
                                    >
                                        <option value="saved">Saved</option>
                                        <option value="applied">Applied</option>
                                        <option value="interviewing">Interviewing</option>
                                        <option value="offered">Offered</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>
                                <td className="muted capitalize">{job.source_site ?? ''}</td>
                                <td className="muted">{formatDate(job.date_posted)}</td>
                                <td className="muted">{formatDate(job.created_at)}</td>
                                <td>
                                    <div className={s.rowActions}>
                                        <button className={`${s.actionBtn} ${s.actionBtnEdit}`} onClick={() => handleEdit(job)}>
                                            <SquarePen size={ICON_SIZE_LG} />
                                        </button>
                                        <button className={`${s.actionBtn} ${s.actionBtnDanger}`} onClick={() => setDeleteTarget(job)}>
                                            <Trash size={ICON_SIZE_LG} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* pagination */}
            {totalPages > 0 && (
                <div className={s.pagination}>
                    <button
                        className="btn btn--ghost btn--with-icon"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        <ArrowLeft size={ICON_SIZE_SM} /> Prev
                    </button>
                    <span className={s.paginationInfo}>Page {page} of {totalPages}</span>
                    <button
                        className="btn btn--ghost btn--with-icon"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next <ArrowRight size={ICON_SIZE_SM} />
                    </button>
                </div>
            )}

            {/* modals */}
            <JobFormModal
                open={formOpen}
                onClose={() => { setFormOpen(false); setEditJob(null) }}
                editJob={editJob}
            />
            <DeleteConfirmModal
                open={!!deleteTarget}
                jobTitle={deleteTarget?.title ?? ''}
                onConfirm={handleDeleteConfirm}
                onClose={() => setDeleteTarget(null)}
                isDeleting={deleteJob.isPending}
            />
        </div>
    )
}