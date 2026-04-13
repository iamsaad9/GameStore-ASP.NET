import React from "react";
import type { Genre, SortKey } from "../types";

interface SearchBarProps {
  search: string;
  genreFilter: string | "";
  sortKey: SortKey;
  genres: Genre[];
  onSearchChange: (value: string) => void;
  onGenreChange: (value: string | "") => void;
  onSortChange: (value: SortKey) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  search,
  genreFilter,
  sortKey,
  genres,
  onSearchChange,
  onGenreChange,
  onSortChange,
}) => {
  return (
    <div className="search-bar">
      <div className="search-bar__input-wrap">
        <svg
          className="search-bar__icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="search-bar__input"
          type="text"
          placeholder="Search games…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search && (
          <button
            className="search-bar__clear"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <select
        className="search-bar__select"
        value={genreFilter}
        onChange={(e) =>
          onGenreChange(e.target.value === "" ? "" : String(e.target.value))
        }
      >
        <option value="">All genres</option>
        {genres.map((g) => (
          <option key={g.id} value={g.name}>
            {g.name}
          </option>
        ))}
      </select>

      <select
        className="search-bar__select"
        value={sortKey}
        onChange={(e) => onSortChange(e.target.value as SortKey)}
      >
        <option value="name">Sort: Name</option>
        <option value="price">Sort: Price</option>
        <option value="releaseDate">Sort: Release date</option>
      </select>
    </div>
  );
};
