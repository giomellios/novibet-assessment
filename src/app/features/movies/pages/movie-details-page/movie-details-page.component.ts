import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, PRIMARY_OUTLET, Router } from '@angular/router';
import { catchError, filter, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { GuestSessionStorageService } from '../../../../core/services/guest-session-storage.service';
import { TmdbService } from '../../../../core/services/tmdb.service';

@Component({
  selector: 'app-movie-details-page',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './movie-details-page.component.html',
  styleUrl: './movie-details-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly guestSessionStorageService = inject(GuestSessionStorageService);
  private readonly tmdbService = inject(TmdbService);

  protected readonly loading = signal(true);
  protected readonly rating = signal(5);

  protected readonly ratingOptions = Array.from({ length: 20 }, (_, i) => (i + 1) * 0.5);
  protected readonly spokenLanguagesText = computed(() => {
    const currentMovie = this.movie();
    if (!currentMovie?.languages.length) {
      return 'N/A';
    }
    return currentMovie.languages.join(', ');
  });

  private readonly routeData$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id')) || 0),
    tap((id) => {
      if (!id) {
        this.close();
      }
    }),
    filter((id) => id > 0),
    tap(() => this.loading.set(true)),
    switchMap((id) =>
      this.tmdbService.getMovieDetails(id).pipe(
        catchError(() => {
          this.snackBar.open('Could not load movie details.', 'Close', { duration: 3500 });
          return of(undefined);
        }),
        finalize(() => this.loading.set(false))
      )
    )
  );

  private readonly movieId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id')) || 0)),
    { initialValue: Number.NaN }
  );

  protected readonly movie = toSignal(this.routeData$, { initialValue: undefined });

  protected close(): void {
    if (this.route.outlet !== PRIMARY_OUTLET) {
      this.router.navigate([{ outlets: { modal: null } }], {
        queryParamsHandling: 'preserve'
      });
      return;
    }

    this.router.navigate(['/']);
  }

  protected submitRating(): void {
    const movieId = this.movieId();
    if (!movieId) {
      return;
    }

    this.ensureGuestSession()
      .pipe(switchMap((sessionId) => this.tmdbService.rateMovie(movieId, sessionId, this.rating())))
      .subscribe({
        next: () => {
          this.snackBar.open('Rating submitted successfully.', 'Close', { duration: 2500 });
        },
        error: () => {
          this.snackBar.open('Failed to submit rating. Please try again.', 'Close', { duration: 3500 });
        }
      });
  }

  private ensureGuestSession(): Observable<string> {
    const cachedSessionId = this.guestSessionStorageService.getValidSessionId();
    if (cachedSessionId) {
      return of(cachedSessionId);
    }

    return this.tmdbService.createGuestSession().pipe(
      map((session) => {
        this.guestSessionStorageService.save(session.guest_session_id, session.expires_at);

        return session.guest_session_id;
      })
    );
  }

}
