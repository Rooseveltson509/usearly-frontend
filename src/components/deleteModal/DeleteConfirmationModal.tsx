import React from "react";
import Modal from "react-modal";
import "./DeleteConfirmationModal.scss";
import { FaExclamationTriangle } from "react-icons/fa";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  brandName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  brandName,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="delete-modal"
      overlayClassName="delete-overlay"
    >
      <div className="modal-content">
        <FaExclamationTriangle className="warning-icon" />
        <h2>Confirmer la suppression</h2>
        <p>
          Voulez-vous vraiment supprimer la marque <strong>{brandName}</strong>{" "}
          ?
        </p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Annuler
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            Oui, supprimer
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;