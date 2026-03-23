import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card.component';
import { MovieCollection } from '../../models/collection.models';
import { CollectionsStorageService } from '../../services/collections-storage.service';

@Component({
  selector: 'app-collection-details-page',
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MovieCardComponent],
  templateUrl: './collection-details-page.component.html',
  styleUrl: './collection-details-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionDetailsPageComponent {
  protected readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly collectionsStorageService = inject(CollectionsStorageService);

  private readonly collectionId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
    { initialValue: null }
  );
  protected readonly collection = computed<MovieCollection | undefined>(() => {
    const id = this.collectionId();
    return id ? this.collectionsStorageService.getCollectionById(id) : undefined;
  });

  protected removeMovie(movieId: number): void {
    const collection = this.collection();
    if (!collection) {
      return;
    }

    this.collectionsStorageService.removeMovieFromCollection(collection.id, movieId);
  }

  protected openMovieDetails(movieId: number): void {
    const collectionId = this.collectionId();
    if (!collectionId) {
      return;
    }

    this.router.navigate([{ outlets: { primary: ['collections', collectionId], modal: ['movie', movieId] } }], {
      queryParamsHandling: 'preserve'
    });
  }

}
