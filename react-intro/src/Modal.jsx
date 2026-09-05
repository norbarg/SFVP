// react-intro/src/Modal.jsx

export default function Modal({ open, title, children, onClose, onConfirm }) {
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
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="modal-confirm"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
