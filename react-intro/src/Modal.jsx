// react-intro/src/Modal.jsx

export default function Modal({
    open,
    title,
    children,
    onClose,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
}) {
    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(event) => event.stopPropagation()}>
                <div className="modal-mark">ATLAS / NOTE</div>

                <h3>{title}</h3>

                <div className="modal-content">{children}</div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="modal-cancel"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        className="modal-confirm"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
