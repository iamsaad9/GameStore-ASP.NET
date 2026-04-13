import React, { useRef, useEffect, useState } from "react";
import type { Game } from "../types";

interface DeleteConfirmModalProps {
  game: Game;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  game,
  onConfirm,
  onClose,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className="modal modal--sm" role="dialog" aria-modal="true">
        <div className="modal__header">
          <h2 className="modal__title">Delete game</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal__body">
          <div className="delete-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </div>
          <p className="delete-msg">
            Are you sure you want to delete <strong>{game.name}</strong>? This
            action cannot be undone.
          </p>
        </div>

        <div className="modal__footer">
          <button
            className="btn btn--ghost"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            className="btn btn--danger"
            onClick={handleConfirm}
            disabled={deleting}
          >
            {deleting ? <span className="btn__spinner" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};
