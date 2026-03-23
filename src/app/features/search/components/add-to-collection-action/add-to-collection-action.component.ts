import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddToCollectionDialogComponent } from '../add-to-collection-dialog/add-to-collection-dialog.component';
import { Movie } from '../../../movies/models/movie.models';
import { CollectionsStorageService } from '../../../collections/services/collections-storage.service';

@Component({
  selector: 'app-add-to-collection-action',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './add-to-collection-action.component.html',
  styleUrl: './add-to-collection-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddToCollectionActionComponent {
  @Input({ required: true }) selectedMovies: Movie[] = [];
  @Output() readonly moviesAdded = new EventEmitter<void>();
  @Output() readonly clearRequested = new EventEmitter<void>();

  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly collectionsStorageService = inject(CollectionsStorageService);
  private readonly router = inject(Router);

  protected get selectedMoviesCount(): number {
    return this.selectedMovies.length;
  }

  protected clearSelection(): void {
    this.clearRequested.emit();
  }

  protected openAddToCollectionDialog(): void {
    const collections = this.collectionsStorageService.getCollections();

    if (!collections.length) {
      const snackBarRef = this.snackBar.open('Create a collection first from the Collections page.', 'Go to Collections', { duration: 5000 });
      
      snackBarRef.onAction().subscribe(() => {
        this.router.navigate(['/collections', 'create']);
      });

      return;
    }

    const dialogRef = this.dialog.open(AddToCollectionDialogComponent, {
      width: '500px',
      data: { selectedMovies: this.selectedMovies }
    });

    dialogRef.afterClosed().subscribe((collectionId: string | undefined) => {
      if (!collectionId) {
        return;
      }

      this.collectionsStorageService.addMoviesToCollection(collectionId, this.selectedMovies);
      this.snackBar.open('Movies added to collection.', 'Close', { duration: 2500 });
      this.moviesAdded.emit();
    });
  }
}
