import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { SearchKeywordValidatorDirective } from '../../directives/search-keyword-validator.directive';
import { SEARCH_DEBOUNCE_MS } from '../../../../core/constants/app.constants';


@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    SearchKeywordValidatorDirective
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBarComponent implements OnChanges, OnInit {
  @Input() initialQuery = '';
  @Output() readonly queryChanged = new EventEmitter<string>();
  @Output() readonly searchSubmitted = new EventEmitter<string>();

  protected readonly searchControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  });

  private readonly destroyRef = inject(DestroyRef);


  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      map((value) => value.trim()),
      debounceTime(SEARCH_DEBOUNCE_MS),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((value) => this.emitDebouncedQuery(value));
  }


  ngOnChanges(changes: SimpleChanges): void {
    if ('initialQuery' in changes) {

      const normalized = this.initialQuery.trim();
      if (this.searchControl.value !== normalized) {
        this.searchControl.setValue(normalized, { emitEvent: false });
      }
    }
  }

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    this.searchControl.markAsTouched();

    if (this.searchControl.invalid) {
      return;
    }

    this.searchSubmitted.emit(this.searchControl.value.trim());
  }

  private emitDebouncedQuery(query: string): void {
    if (!query) {
      this.queryChanged.emit('');
      return;
    }

    if (this.searchControl.invalid) return;

    this.queryChanged.emit(query);
  }
}
