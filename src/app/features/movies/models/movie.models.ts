export interface TmdbMovieSummary {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
}

export interface TmdbMovieSearchResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: TmdbMovieSummary[];
}

export interface MovieLanguage {
  english_name: string;
  name: string;
}

export interface TmdbMovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  budget: number;
  release_date: string;
  revenue: number;
  vote_average: number;
  vote_count: number;
  spoken_languages: MovieLanguage[];
}

export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  rating: number;
}

export interface MovieSearchResult {
  results: Movie[];
  totalResults: number;
}

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  posterPath: string | null;
  budget: number;
  releaseDate: string;
  revenue: number;
  rating: number;
  voteCount: number;
  languages: string[];
}

export interface CreateGuestSessionResponse {
  success: boolean;
  guest_session_id: string;
  expires_at: string;
}

export interface TmdbStatusResponse {
  status_code: number;
  status_message: string;
}