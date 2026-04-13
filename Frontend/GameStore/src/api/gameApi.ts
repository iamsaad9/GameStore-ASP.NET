import type { Game, GameFormData, Genre } from "../types";
const BASE_URL = "http://localhost:5289";

export const genreApi = {
  getAll: async (): Promise<Genre[]> => {
    const res = await fetch(`${BASE_URL}/genres`);
    if (!res.ok) throw new Error("Failed to fetch genres");
    return res.json();
  },
};

export const gameApi = {
  getAll: async (): Promise<Game[]> => {
    const res = await fetch(`${BASE_URL}/games`);
    if (!res.ok) throw new Error("Failed to fetch games");
    return res.json();
  },

  create: async (data: GameFormData): Promise<Game> => {
    const res = await fetch(`${BASE_URL}/games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create game");
    return res.json();
  },

  update: async (id: number, data: GameFormData): Promise<void> => {
    const res = await fetch(`${BASE_URL}/games/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to update game");
    }
    return;
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/games/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete game");
  },
};
