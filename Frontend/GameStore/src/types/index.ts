export interface Genre {
  id: number;
  name: string;
}

export interface Game {
  id: number;
  name: string;
  genre?: string;
  genreId: number;
  price: number;
  releaseDate: string;
}

export type GameFormData = Omit<Game, "id" | "genre">;

export type SortKey = "name" | "price" | "releaseDate";
