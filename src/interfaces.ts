import { QueryResult } from "pg";

interface movies {
  id: number;
  name: string;
  category: string;
  duration: number;
  price: number;
}

type createMovies = Omit<movies, "id">;
type MoviesResult = QueryResult<movies>

export { movies, createMovies, MoviesResult };