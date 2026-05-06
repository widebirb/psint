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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal--sm" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Delete Application</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to delete <strong>{jobTitle}</strong>? This cannot be undone.</p>
                </div>
                <div className="modal-footer">
                    <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
                    <button className="btn btn--danger" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    )
}