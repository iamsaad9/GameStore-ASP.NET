import React from "react";
import type { Game } from "../types";

interface GameCardProps {
  game: Game;
  onEdit: (game: Game) => void;
  onDelete: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="game-card">
      <div className="game-card__inner">
        <div className="game-card__header">
          <span className="game-card__genre">{game.genre ?? "Unknown"}</span>
          <div className="game-card__actions">
            <button
              className="icon-btn icon-btn--edit"
              onClick={() => onEdit(game)}
              aria-label="Edit game"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              className="icon-btn icon-btn--delete"
              onClick={() => onDelete(game)}
              aria-label="Delete game"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </div>
        </div>

        <h3 className="game-card__name">{game.name}</h3>

        <div className="game-card__footer">
          <span className="game-card__price">${game.price.toFixed(2)}</span>
          <span className="game-card__date">
            {new Date(game.releaseDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
