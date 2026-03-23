import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { Movie } from '../../../movies/models/movie.models';
import { CollectionsStorageService } from '../../../collections/services/collections-storage.service';

export interface AddToCollectionDialogData {
  selectedMovies: Movie[];
}

@Component({
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatRadioModule],
  templateUrl: './add-to-collection-dialog.component.html',
  styleUrl: './add-to-collection-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddToCollectionDialogComponent {
  private readonly collectionsStorageService = inject(CollectionsStorageService);
  protected readonly collections = toSignal(this.collectionsStorageService.collections$, { initialValue: [] });
  protected selectedCollectionId = '';

  constructor(private readonly dialogRef: MatDialogRef<AddToCollectionDialogComponent, string>) {}

  protected cancel(): void {
    this.dialogRef.close();
  }

  protected confirm(): void {
    if (!this.selectedCollectionId) {
      return;
    }

    this.dialogRef.close(this.selectedCollectionId);
  }
}
