import { useState, useEffect, useCallback } from "react";
import type { Game, GameFormData, Genre } from "../types";
import { gameApi, genreApi } from "../api/gameApi";

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [gamesData, genresData] = await Promise.all([
        gameApi.getAll(),
        genreApi.getAll(),
      ]);
      setGames(gamesData);
      setGenres(genresData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addGame = useCallback(async (data: GameFormData) => {
    const newGame = await gameApi.create(data);
    setGames((prev) => [...prev, newGame]);
  }, []);

  const updateGame = useCallback(async (id: number, data: GameFormData) => {
    await gameApi.update(id, data);
    await fetchAll(); // 👈 this is the safe fix
  }, []);

  const deleteGame = useCallback(async (id: number) => {
    await gameApi.delete(id);
    setGames((prev) => prev.filter((g) => g.id !== id));
  }, []);

  return {
    games,
    genres,
    loading,
    error,
    addGame,
    updateGame,
    deleteGame,
    refetch: fetchAll,
  };
}
