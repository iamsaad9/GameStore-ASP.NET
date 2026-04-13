import React from "react";
import type { Game } from "../types";

interface StatsBarProps {
  games: Game[];
  filteredCount: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({ games, filteredCount }) => {
  const avgPrice =
    games.length > 0
      ? games.reduce((sum, g) => sum + g.price, 0) / games.length
      : 0;

  const uniqueGenres = new Set(games.map((g) => g.genre).filter(Boolean)).size;
  console.log("Unique Genre", uniqueGenres);

  const stats = [
    { label: "Total games", value: games.length },
    { label: "Genres", value: uniqueGenres },
    { label: "Avg price", value: `$${avgPrice.toFixed(2)}` },
    { label: "Showing", value: filteredCount },
  ];

  return (
    <div className="stats-bar">
      {stats.map((s) => (
        <div key={s.label} className="stat-card">
          <span className="stat-card__label">{s.label}</span>
          <span className="stat-card__value">{s.value}</span>
        </div>
      ))}
    </div>
  );
};
