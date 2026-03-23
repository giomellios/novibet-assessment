import { Movie } from '../../movies/models/movie.models';

export interface MovieCollection {
  id: string;
  title: string;
  description: string;
  movies: Movie[];
  createdAt: string;
}