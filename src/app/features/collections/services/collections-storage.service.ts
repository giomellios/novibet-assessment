import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { STORAGE_KEYS } from '../../../core/constants/app.constants';
import { MovieCollection } from '../models/collection.models';
import { Movie } from '../../movies/models/movie.models';
import { BrowserStorageService } from '../../../core/services/browser-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CollectionsStorageService {
  private readonly storageKey = STORAGE_KEYS.movieCollections;
  private readonly collectionsState = signal<MovieCollection[]>([]);
  private readonly browserStorageService = inject(BrowserStorageService);
  readonly collections = computed(() => this.collectionsState());
  readonly collections$ = toObservable(this.collectionsState);

  constructor() {
    this.collectionsState.set(this.readCollections());
  }
  
  getCollections(): MovieCollection[] {
    return this.collectionsState();
  }

  getCollectionById(id: string): MovieCollection | undefined {
    return this.getCollections().find((collection) => collection.id === id);
  }

  createCollection(title: string, description: string): MovieCollection {
    const collections = this.collectionsState();
    const collection: MovieCollection = {
      id: crypto.randomUUID(),
      title,
      description,
      movies: [],
      createdAt: new Date().toISOString()
    };

    this.persistCollections([collection, ...collections]);
    return collection;
  }

  addMoviesToCollection(collectionId: string, movies: Movie[]): void {
    const collections = this.collectionsState().map((collection) => {
      if (collection.id !== collectionId) {
        return collection;
      }

      const existingIds = new Set(collection.movies.map((movie) => movie.id));
      const mergedMovies = [...collection.movies];

      for (const movie of movies) {
        if (!existingIds.has(movie.id)) {
          mergedMovies.push(movie);
          existingIds.add(movie.id);
        }
      }

      return { ...collection, movies: mergedMovies };
    });

    this.persistCollections(collections);
  }

  removeMovieFromCollection(collectionId: string, movieId: number): void {
    const collections = this.collectionsState().map((collection) => {
      if (collection.id !== collectionId) {
        return collection;
      }

      return {
        ...collection,
        movies: collection.movies.filter((movie) => movie.id !== movieId)
      };
    });

    this.persistCollections(collections);
  }

  removeCollection(collectionId: string): void {
    const collections = this.collectionsState().filter((collection) => collection.id !== collectionId);
    this.persistCollections(collections);
  }

  private persistCollections(collections: MovieCollection[]): void {
    this.collectionsState.set(collections);
    this.browserStorageService.setJson(this.storageKey, collections);
  }

  private readCollections(): MovieCollection[] {
    const parsed = this.browserStorageService.getJson<unknown>(this.storageKey);
    return Array.isArray(parsed) ? (parsed as MovieCollection[]) : [];
  }
}
