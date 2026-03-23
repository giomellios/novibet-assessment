import { environment } from '../../../environments/environment';

export const TMDB_API_KEY = environment.tmdbApiKey;
export const TMDB_API_BASE_URL = environment.tmdbApiBaseUrl;
export const TMDB_IMAGE_BASE_URL = environment.tmdbImageBaseUrl;
export const SEARCH_DEBOUNCE_MS = 400;


export const STORAGE_KEYS = {
  movieCollections: 'movie_collections',
  tmdbGuestSession: 'tmdb_guest_session'
} as const;