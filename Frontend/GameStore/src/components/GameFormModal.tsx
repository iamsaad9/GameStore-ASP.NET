import React, { useState, useEffect, useRef } from "react";
import type { Game, GameFormData, Genre } from "../types";

interface GameFormModalProps {
  game?: Game | null;
  genres: Genre[];
  onSubmit: (data: GameFormData) => Promise<void>;
  onClose: () => void;
}

export const GameFormModal: React.FC<GameFormModalProps> = ({
  game,
  genres,
  onSubmit,
  onClose,
}) => {
  const isEdit = !!game;
  const overlayRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<GameFormData>({
    name: game?.name ?? "",
    genreId: game?.genreId ?? genres[0]?.id ?? 1,
    price: game?.price ?? 0,
    releaseDate: game?.releaseDate ?? new Date().toISOString().split("T")[0],
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof GameFormData, string>>
  >({});

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof GameFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (form.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!form.releaseDate) newErrors.releaseDate = "Release date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "Edit game" : "Add game"}
      >
        <div className="modal__header">
          <h2 className="modal__title">
            {isEdit ? "Edit game" : "Add new game"}
          </h2>
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

        <form className="modal__form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="name">
              Game name
            </label>
            <input
              id="name"
              className={`field__input${errors.name ? " field__input--error" : ""}`}
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Elden Ring"
              autoFocus
            />
            {errors.name && <span className="field__error">{errors.name}</span>}
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field__label" htmlFor="genre">
                Genre
              </label>
              <select
                id="genre"
                className="field__input"
                value={form.genreId}
                onChange={(e) =>
                  setForm({ ...form, genreId: Number(e.target.value) })
                }
              >
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="price">
                Price ($)
              </label>
              <input
                id="price"
                className={`field__input${errors.price ? " field__input--error" : ""}`}
                type="number"
                min="0"
                step="0.01"
                value={form.price || ""}
                onChange={(e) =>
                  setForm({ ...form, price: parseFloat(e.target.value) || 0 })
                }
                placeholder="49.99"
              />
              {errors.price && (
                <span className="field__error">{errors.price}</span>
              )}
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="releaseDate">
              Release date
            </label>
            <input
              id="releaseDate"
              className={`field__input${errors.releaseDate ? " field__input--error" : ""}`}
              type="date"
              value={form.releaseDate}
              onChange={(e) =>
                setForm({ ...form, releaseDate: e.target.value })
              }
            />
            {errors.releaseDate && (
              <span className="field__error">{errors.releaseDate}</span>
            )}
          </div>

          <div className="modal__footer">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitting}
            >
              {submitting ? (
                <span className="btn__spinner" />
              ) : isEdit ? (
                "Save changes"
              ) : (
                "Add game"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
