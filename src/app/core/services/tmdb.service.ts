import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  CreateGuestSessionResponse,
  MovieDetails,
  Movie,
  MovieSearchResult,
  TmdbMovieDetails,
  TmdbMovieSearchResponse,
  TmdbMovieSummary,
  TmdbStatusResponse
} from '../../features/movies/models/movie.models';
import { TMDB_API_BASE_URL, TMDB_API_KEY, TMDB_IMAGE_BASE_URL } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private readonly apiUrl = TMDB_API_BASE_URL;
  private readonly apiKey = TMDB_API_KEY;

  constructor(private readonly http: HttpClient) {}

  searchMovies(query: string, page = 1): Observable<MovieSearchResult> {
    const params = this.createAuthParams()
      .set('query', query)
      .set('page', page)

    return this.http
      .get<TmdbMovieSearchResponse>(`${this.apiUrl}/search/movie`, { params })
      .pipe(
        map((response) => ({
          results: response.results.map((movie) => this.mapToMovie(movie)),
          totalResults: response.total_results
        }))
      );
  }

  getMovieDetails(movieId: number): Observable<MovieDetails> {
    const params = this.createAuthParams();
    return this.http
      .get<TmdbMovieDetails>(`${this.apiUrl}/movie/${movieId}`, { params })
      .pipe(map((response) => this.mapToMovieDetails(response)));
  }

  createGuestSession(): Observable<CreateGuestSessionResponse> {
    const params = this.createAuthParams();
    return this.http.get<CreateGuestSessionResponse>(`${this.apiUrl}/authentication/guest_session/new`, { params });
  }

  rateMovie(movieId: number, guestSessionId: string, rating: number): Observable<TmdbStatusResponse> {
    const params = this.createAuthParams().set('guest_session_id', guestSessionId);
    return this.http.post<TmdbStatusResponse>(`${this.apiUrl}/movie/${movieId}/rating`, { value: rating }, { params });
  }

  buildPosterUrl(posterPath: string | null, size: 'w154' | 'w185' | 'w342' | 'w500' = 'w342'): string {
    if (!posterPath) {
      return 'https://placehold.co/342x513?text=No+Poster';
    }

    return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
  }

  private createAuthParams(): HttpParams {
    return new HttpParams().set('api_key', this.apiKey);
  }

  private mapToMovie(movie: TmdbMovieSummary): Movie {
    return {
      id: movie.id,
      title: movie.title,
      posterUrl: this.buildPosterUrl(movie.poster_path),
      rating: movie.vote_average
    };
  }

  private mapToMovieDetails(movie: TmdbMovieDetails): MovieDetails {
    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterUrl: this.buildPosterUrl(movie.poster_path, 'w500'),
      posterPath: movie.poster_path,
      budget: movie.budget,
      releaseDate: movie.release_date,
      revenue: movie.revenue,
      rating: movie.vote_average,
      voteCount: movie.vote_count,
      languages: movie.spoken_languages.map((language) => language.english_name || language.name)
    };
  }
}
