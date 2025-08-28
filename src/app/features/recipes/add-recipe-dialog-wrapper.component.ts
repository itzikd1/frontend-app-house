import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Recipe } from '../../shared/models/recipe.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ModalDialogComponent } from '../../shared/components/modal-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-add-recipe-dialog-wrapper',
  standalone: true,
  imports: [
    ModalDialogComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule
  ],
  template: `
    <app-modal-dialog
      [title]="'Add Recipe'"
      [submitLabel]="'Add'"
      [cancelLabel]="'Cancel'"
      (submit)="onSubmit()"
      (cancel)="onCancel()"
    >
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Title</mat-label>
        <input matInput type="text" [(ngModel)]="recipe.title" name="title" required />
      </mat-form-field>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Description</mat-label>
        <input matInput type="text" [(ngModel)]="recipe.description" name="description" />
      </mat-form-field>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Servings</mat-label>
        <input matInput type="number" [(ngModel)]="recipe.servings" name="servings" min="1" />
      </mat-form-field>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Instructions</mat-label>
        <input matInput type="text" [(ngModel)]="recipe.instructions" name="instructions" />
      </mat-form-field>
      <!-- For simplicity, ingredients as a comma-separated string -->
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Ingredients</mat-label>
        <input matInput type="text" [(ngModel)]="ingredientsInput" name="ingredients" />
      </mat-form-field>
    </app-modal-dialog>
  `,
  styleUrls: ['../../shared/components/modal-dialog.component.scss']
})
export class AddRecipeDialogWrapperComponent {
  recipe: Partial<Recipe> = { title: '', description: '', servings: 1, instructions: '', ingredients: [] };
  ingredientsInput = '';

  constructor(
    private dialogRef: MatDialogRef<AddRecipeDialogWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSubmit(): void {
    this.recipe.ingredients = this.ingredientsInput
      ? this.ingredientsInput.split(',').map(i => ({ name: i.trim(), amount: 1, unit: '' }))
      : [];
    this.dialogRef.close(this.recipe);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
