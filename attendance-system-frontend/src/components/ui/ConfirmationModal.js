// src/components/ui/ConfirmationModal.js

import React from "react";
import { useModal } from "../../context/ModalContext";
import "./ConfirmationModal.scss";

const ConfirmationModal = () => {
  // Get all state and functions from the ModalContext
  const { isOpen, message, title, handleConfirm, handleCancel } = useModal();

  // If the modal is not supposed to be open, render nothing.
  if (!isOpen) {
    return null;
  }

  // Stop clicks inside the modal from closing it
  const stopPropagation = (e) => e.stopPropagation();

  return (
    // The overlay covers the whole screen. Clicking it cancels the action.
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={stopPropagation}>
        <h3 className="modal-title">{title || "Confirm Action"}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button onClick={handleCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleConfirm} className="btn btn-danger">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
