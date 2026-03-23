import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, distinctUntilChanged, finalize, map, of, switchMap } from 'rxjs';
import { AddToCollectionActionComponent } from '../../components/add-to-collection-action/add-to-collection-action.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card.component';
import { Movie, MovieSearchResult } from '../../../movies/models/movie.models';
import { TmdbService } from '../../../../core/services/tmdb.service';

@Component({
  selector: 'app-search-page',
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    AddToCollectionActionComponent,
    SearchBarComponent,
    MovieCardComponent,
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent {
  protected readonly initialQuery = computed(() => this.searchParams().q);
  protected readonly results = computed(() => this.movieData()?.results ?? []);
  protected readonly loading = signal(false);
  protected readonly currentPage = computed(() => this.searchParams().page);
  protected readonly totalResults = computed(() => this.movieData()?.totalResults ?? 0);
  protected readonly pageSize = 20;
  protected readonly errorMessage = signal('');

  protected readonly selectedMovies = signal<Map<number, Movie>>(new Map());
  protected readonly selectedMoviesCount = computed(() => this.selectedMovies().size);
  protected readonly hasSelectedMovies = computed(() => this.selectedMoviesCount() > 0);
  protected readonly selectedMoviesList = computed(() => Array.from(this.selectedMovies().values()));
  protected readonly hasSearched = computed(() => this.searchParams().q.length > 2);

  private readonly tmdbService = inject(TmdbService);
  private readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);

  private readonly searchParams$ = this.route.queryParams.pipe(
    map((params) => ({
      q: `${params['q'] ?? ''}`.trim(),
      page: this.parsePage(params['page'] ?? null)
    })),
    distinctUntilChanged((a, b) => a.q === b.q && a.page === b.page)
  );

  private readonly searchParams = toSignal(this.searchParams$, { initialValue: { q: '', page: 1 } });

  protected readonly movieData = toSignal<MovieSearchResult | null>(
    this.searchParams$.pipe(
      switchMap(({ q, page }) => {
        if (!q) {
          this.loading.set(false);
          this.errorMessage.set('');
          return of(null);
        }

        this.loading.set(true);
        this.errorMessage.set('');

        return this.tmdbService.searchMovies(q, page).pipe(
          catchError(() => {
            this.errorMessage.set('Could not fetch movies. Please try again.');
            return of(null);
          }),
          finalize(() => this.loading.set(false))
        );
      })
    ),
    { initialValue: null }
  );

  protected onQueryChanged(query: string): void {
    if (query === this.searchParams().q) {
      return;
    }

    this.navigateWithQuery(query, 1);
  }

  protected onSearchSubmitted(query: string): void {
    this.navigateWithQuery(query, 1);
  }

  protected onPageChange(event: PageEvent): void {
    this.navigateWithQuery(this.searchParams().q, event.pageIndex + 1);
  }

  protected toggleMovieSelection(movie: Movie, selected: boolean): void {
    const currentSelection = new Map(this.selectedMovies());
    if (selected) {
      currentSelection.set(movie.id, movie);
      this.selectedMovies.set(currentSelection);
      return;
    }

    currentSelection.delete(movie.id);
    this.selectedMovies.set(currentSelection);
  }

  protected isMovieSelected(movieId: number): boolean {
    return this.selectedMovies().has(movieId);
  }

  protected openMovieDetails(movieId: number): void {
    this.router.navigate([{ outlets: { modal: ['movie', movieId] } }], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve'
    });
  }

  protected onMoviesAddedToCollection(): void {
    this.selectedMovies.set(new Map());
  }

  protected clearSelection(): void {
    this.selectedMovies.set(new Map());
  }

  private navigateWithQuery(query: string, page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: query || null,
        page: query ? page : null
      },
      replaceUrl: true
    });
  }

  private parsePage(pageParam: string | null | number): number {
    const parsed = Number(pageParam);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  }

}
