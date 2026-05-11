import s from './Modal.module.css'

interface Props {
    open: boolean
    jobTitle: string
    onConfirm: () => void
    onClose: () => void
    isDeleting: boolean
}

export default function DeleteConfirmModal({ open, jobTitle, onConfirm, onClose, isDeleting }: Props) {
    if (!open) return null

    return (
        <div className={s.overlay} onClick={onClose}>
            <div className={`${s.modal} ${s.modalSm}`} onClick={(e) => e.stopPropagation()}>
                <div className={s.header}>
                    <h2>Delete Application</h2>
                    <button className={s.closeBtn} onClick={onClose}>✕</button>
                </div>
                <div className={s.body}>
                    <p>Are you sure you want to delete <strong>{jobTitle}</strong>? This cannot be undone.</p>
                </div>
                <div className={s.footer}>
                    <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
                    <button className="btn btn--danger" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    )
}