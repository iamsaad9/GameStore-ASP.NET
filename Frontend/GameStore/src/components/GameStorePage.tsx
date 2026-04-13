import React, { useState, useMemo } from "react";
import type { Game, GameFormData, SortKey } from "../types";
import { useGames } from "../hooks/useGames";
import { useToast } from "../hooks/useToast";
import { GameCard } from "./GameCard";
import { GameFormModal } from "./GameFormModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { ToastContainer } from "./ToastContainer";
import { StatsBar } from "./StatsBar";
import { SearchBar } from "./SearchBar";

type ModalState =
  | { type: "none" }
  | { type: "add" }
  | { type: "edit"; game: Game }
  | { type: "delete"; game: Game };

export const GameStorePage: React.FC = () => {
  const { games, genres, loading, error, addGame, updateGame, deleteGame } =
    useGames();
  const { toasts, addToast, removeToast } = useToast();

  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState<string | "">("");
  const [sortKey, setSortKey] = useState<SortKey>("name");

  const filteredGames = useMemo(() => {
    let result = [...games];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((g) => g.name.toLowerCase().includes(q));
    }

    if (genreFilter !== "") {
      result = result.filter((g) => g.genre === genreFilter);
    }

    result.sort((a, b) => {
      if (sortKey === "price") return a.price - b.price;
      if (sortKey === "releaseDate")
        return a.releaseDate.localeCompare(b.releaseDate);
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [games, search, genreFilter, sortKey]);

  const handleAdd = async (data: GameFormData) => {
    try {
      await addGame(data);
      addToast(`"${data.name}" added successfully`);
    } catch {
      addToast("Failed to add game", "error");
      throw new Error("add failed");
    }
  };

  const handleUpdate = async (data: GameFormData) => {
    if (modal.type !== "edit") return;
    try {
      await updateGame(modal.game.id, data);
      addToast(`"${data.name}" updated successfully`);
    } catch {
      addToast("Failed to update game", "error");
      throw new Error("update failed");
    }
  };

  const handleDelete = async () => {
    if (modal.type !== "delete") return;
    const name = modal.game.name;
    try {
      await deleteGame(modal.game.id);
      addToast(`"${name}" deleted`);
    } catch {
      addToast("Failed to delete game", "error");
      throw new Error("delete failed");
    }
  };

  return (
    <div className="gs-page">
      <header className="gs-header">
        <div className="gs-header__text">
          <h1 className="gs-header__title">Game Store</h1>
          <p className="gs-header__sub">Manage your catalog</p>
        </div>
        <button
          className="btn btn--primary"
          onClick={() => setModal({ type: "add" })}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add game
        </button>
      </header>

      <StatsBar games={games} filteredCount={filteredGames.length} />

      <SearchBar
        search={search}
        genreFilter={genreFilter}
        sortKey={sortKey}
        genres={genres}
        onSearchChange={setSearch}
        onGenreChange={setGenreFilter}
        onSortChange={setSortKey}
      />

      {loading && (
        <div className="gs-state">
          <div className="gs-spinner" />
          <p>Loading games…</p>
        </div>
      )}

      {error && !loading && (
        <div className="gs-state gs-state--error">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && filteredGames.length === 0 && (
        <div className="gs-state">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <p>
            {search || genreFilter
              ? "No games match your filters."
              : "No games yet. Add one!"}
          </p>
        </div>
      )}

      {!loading && !error && (
        <div className="games-grid">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onEdit={(g) => setModal({ type: "edit", game: g })}
              onDelete={(g) => setModal({ type: "delete", game: g })}
            />
          ))}
        </div>
      )}

      {modal.type === "add" && (
        <GameFormModal
          genres={genres}
          onSubmit={handleAdd}
          onClose={() => setModal({ type: "none" })}
        />
      )}

      {modal.type === "edit" && (
        <GameFormModal
          game={modal.game}
          genres={genres}
          onSubmit={handleUpdate}
          onClose={() => setModal({ type: "none" })}
        />
      )}

      {modal.type === "delete" && (
        <DeleteConfirmModal
          game={modal.game}
          onConfirm={handleDelete}
          onClose={() => setModal({ type: "none" })}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};
