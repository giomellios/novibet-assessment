import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Movie } from '../../../features/movies/models/movie.models';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatTooltipModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: Movie;
  @Input() selected = false;
  @Input() showSelection = false;
  @Input() showRemove = false;

  @Output() selectionChange = new EventEmitter<boolean>();
  @Output() details = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();

  protected readonly fallbackPosterUrl = 'https://placehold.co/342x513?text=No+Poster';

  protected onSelectionChange(selected: boolean): void {
    this.selectionChange.emit(selected);
  }

  protected openDetails(): void {
    this.details.emit(this.movie.id);
  }

  protected removeMovie(): void {
    this.remove.emit(this.movie.id);
  }
}
