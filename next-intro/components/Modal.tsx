'use client';

import type { ReactNode } from 'react';

type ModalProps = {
    open: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
};

export default function Modal({
    open,
    title,
    children,
    onClose,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
}: ModalProps) {
    if (!open) {
        return null;
    }

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
