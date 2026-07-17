import { useState } from 'react'
import { toast } from 'sonner'
import { Trash2, Download, CircleQuestionMarkIcon } from 'lucide-react'
import { useUser } from '../hooks/useUser'
import s from './SettingsModal.module.css'
import ms from './Modal.module.css'

interface Props {
    open: boolean
    onClose: () => void
}

export default function SettingsModal({ open, onClose }: Props) {
    const { data: user } = useUser()
    const [deleteConfirm, setDeleteConfirm] = useState(false)

    if (!open) return null

    return (
        <div className={ms.overlay} onClick={onClose}>
            <div className={`${ms.modal} ${ms.modalSm}`} onClick={e => e.stopPropagation()}>
                <div className={ms.header}>
                    <h2>Settings</h2>
                    <button className={ms.closeBtn} onClick={onClose}>✕</button>
                </div>

                <div className={s.content}>
                    <section className={s.section}>
                        <h3 className={s.sectionTitle}>Account</h3>
                        <div className={s.profileCard}>
                            <div className={s.avatar}>
                                {user?.avatar_url
                                    ? <img src={user.avatar_url} alt={user.name ?? 'User'} referrerPolicy="no-referrer" />
                                    : <span className={s.avatarFallback}>
                                        {user?.name?.charAt(0).toUpperCase() ?? <CircleQuestionMarkIcon size={24} />}
                                    </span>
                                }
                            </div>
                            <div className={s.profileInfo}>
                                <span className={s.profileName}>{user?.name ?? 'User'}</span>
                                <span className={s.profileEmail}>{user?.email}</span>
                            </div>
                        </div>
                    </section>

                    <section className={s.section}>
                        <h3 className={s.sectionTitle}>Data</h3>
                        <button className={s.exportBtn} onClick={() => toast.info('Export coming soon')}>
                            <Download size={16} />
                            <span>Export Applications</span>
                        </button>
                    </section>

                    <div className={s.separator} />

                    <section className={s.section}>
                        {!deleteConfirm ? (
                            <button className={s.dangerBtn} onClick={() => setDeleteConfirm(true)}>
                                <Trash2 size={16} />
                                <span>Delete Account</span>
                            </button>
                        ) : (
                            <div className={s.deleteConfirm}>
                                <p className={s.deleteWarning}>Are you sure? This cannot be undone.</p>
                                <div className={s.deleteActions}>
                                    <button className="btn btn--ghost" onClick={() => setDeleteConfirm(false)}>
                                        Cancel
                                    </button>
                                    <button className={s.dangerBtn} onClick={() => {
                                        toast.info('Account deletion not yet implemented')
                                        setDeleteConfirm(false)
                                    }}>
                                        Delete My Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

            </div>
        </div>
    )
}
