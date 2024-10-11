import React from 'react';
import './ConfirmationModal.sass';

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="confirmation-modal-overlay">
            <div className="confirmation-modal">
                <p className="confirmation-modal__message">{message}</p>
                <div className="confirmation-modal__buttons">
                    <button className="confirmation-modal__button confirm" onClick={onConfirm}>
                        예
                    </button>
                    <button className="confirmation-modal__button cancel" onClick={onCancel}>
                        아니오
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
