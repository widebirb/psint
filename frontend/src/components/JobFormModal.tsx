import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateJob, useUpdateJob } from '../hooks/useJobs'
import type { Job } from '../types/job'
import s from './Modal.module.css'

const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    company: z.string().min(1, 'Company is required'),
    location: z.string().optional(),
    job_type: z.string().optional(),
    salary_range: z.string().optional(),
    description_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    source_site: z.enum(['linkedin', 'indeed', 'jobstreet', 'manual']).optional(),
    date_posted: z.string().optional(),
    status: z.enum(['saved', 'applied', 'interviewing', 'offered', 'rejected']),
    notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
    open: boolean
    onClose: () => void
    editJob?: Job | null
}

export default function JobFormModal({ open, onClose, editJob }: Props) {
    const createJob = useCreateJob()
    const updateJob = useUpdateJob()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { status: 'saved', source_site: 'manual' },
    })

    useEffect(() => {
        if (editJob) {
            reset({
                title: editJob.title,
                company: editJob.company,
                location: editJob.location ?? '',
                job_type: editJob.job_type ?? '',
                salary_range: editJob.salary_range ?? '',
                description_url: editJob.description_url ?? '',
                source_site: editJob.source_site ?? 'manual',
                date_posted: editJob.date_posted ?? '',
                status: editJob.status,
                notes: editJob.notes ?? '',
            })
        } else {
            reset({ status: 'saved', source_site: 'manual' })
        }
    }, [editJob, reset])

    if (!open) return null

    const onSubmit = async (values: FormValues) => {
        const payload = {
            ...values,
            description_url: values.description_url || undefined,
            date_posted: values.date_posted || undefined,
        }

        if (editJob) {
            await updateJob.mutateAsync({ id: editJob.id, payload })
        } else {
            await createJob.mutateAsync(payload)
        }
        onClose()
    }

    return (
        <div className={s.overlay} onClick={onClose}>
            <div className={s.modal} onClick={(e) => e.stopPropagation()}>
                <div className={s.header}>
                    <h2>{editJob ? 'Edit Application' : 'Add Application'}</h2>
                    <button className={s.closeBtn} onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
                    <div className={s.formRow}>
                        <div className={s.formGroup}>
                            <label>Job Title *</label>
                            <input {...register('title')} placeholder="e.g. Software Engineer" />
                            {errors.title && <span className={s.formError}>{errors.title.message}</span>}
                        </div>
                        <div className={s.formGroup}>
                            <label>Company *</label>
                            <input {...register('company')} placeholder="e.g. Acme Corp" />
                            {errors.company && <span className={s.formError}>{errors.company.message}</span>}
                        </div>
                    </div>

                    <div className={s.formRow}>
                        <div className={s.formGroup}>
                            <label>Location</label>
                            <input {...register('location')} placeholder="e.g. Remote, Manila" />
                        </div>
                        <div className={s.formGroup}>
                            <label>Job Type</label>
                            <select {...register('job_type')}>
                                <option value=""> Select </option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                    </div>

                    <div className={s.formRow}>
                        <div className={s.formGroup}>
                            <label>Salary Range</label>
                            <input {...register('salary_range')} placeholder="e.g. ₱80,000–₱120,000" />
                        </div>
                        <div className={s.formGroup}>
                            <label>Date Posted</label>
                            <input type="date" {...register('date_posted')} />
                        </div>
                    </div>

                    <div className={s.formRow}>
                        <div className={s.formGroup}>
                            <label>Status</label>
                            <select {...register('status')}>
                                <option value="saved">Saved</option>
                                <option value="applied">Applied</option>
                                <option value="interviewing">Interviewing</option>
                                <option value="offered">Offered</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className={s.formGroup}>
                            <label>Source</label>
                            <select {...register('source_site')}>
                                <option value="manual">Manual</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="indeed">Indeed</option>
                                <option value="jobstreet">JobStreet</option>
                            </select>
                        </div>
                    </div>

                    <div className={s.formGroup}>
                        <label>Job Posting URL</label>
                        <input {...register('description_url')} placeholder="https://..." />
                        {errors.description_url && (
                            <span className={s.formError}>{errors.description_url.message}</span>
                        )}
                    </div>

                    <div className={s.formGroup}>
                        <label>Notes</label>
                        <textarea {...register('notes')} rows={3} placeholder="Recruiter name, interview notes, etc." />
                    </div>

                    <div className={s.footer}>
                        <button type="button" className="btn btn--ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : editJob ? 'Save Changes' : 'Add Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}