import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CollectionsStorageService } from '../../services/collections-storage.service';

@Component({
  selector: 'app-collection-create-page',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './collection-create-page.component.html',
  styleUrl: './collection-create-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionCreatePageComponent {
  protected readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  private readonly collectionsStorageService = inject(CollectionsStorageService);
  private readonly router = inject(Router);
  
  protected createCollection(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const collection = this.collectionsStorageService.createCollection(
      this.form.controls.title.value.trim(),
      this.form.controls.description.value.trim()
    );

     this.router.navigate(['/collections', collection.id]);
  }

  protected cancel(): void {
    this.router.navigate(['/collections']);
  }

}
