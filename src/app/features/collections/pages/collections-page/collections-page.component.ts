import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { CollectionsStorageService } from '../../services/collections-storage.service';

@Component({
  selector: 'app-collections-page',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './collections-page.component.html',
  styleUrl: './collections-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionsPageComponent {
  private readonly dialog = inject(MatDialog);
  private readonly collectionsStorageService = inject(CollectionsStorageService);
  protected readonly collections = this.collectionsStorageService.collections;

  removeCollection(collectionId: string): void {
    const collection = this.collections().find((item) => item.id === collectionId);
    const collectionName = collection?.title ?? 'this collection';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Remove Collection',
        message: `Are you sure you want to remove "${collectionName}"? This action cannot be undone.`,
        confirmText: 'Remove',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (!confirmed) {
        return;
      }

      this.collectionsStorageService.removeCollection(collectionId);
    });
  }

}
