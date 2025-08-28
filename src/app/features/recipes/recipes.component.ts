import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { RecipeService } from '../../core/services/recipe.service';
import { Recipe } from '../../shared/models/recipe.model';
import { CommonModule } from '@angular/common';
import { ItemListComponent } from '../../shared/components/item-list/item-list.component';
import { FabButtonComponent } from '../../shared/components/fab-button/fab-button.component';
import { ItemCardComponent } from '../../shared/components/item-card/item-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AddRecipeDialogWrapperComponent } from './add-recipe-dialog-wrapper.component';
import { ModalDialogComponent } from '../../shared/components/modal-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ItemListComponent,
    FabButtonComponent,
    ItemCardComponent,
    LoadingSpinnerComponent,
    MatButtonModule,
    MatIconModule,
    ModalDialogComponent,
    AddRecipeDialogWrapperComponent
  ],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipesComponent implements OnInit {
  recipes = signal<Recipe[]>([]);
  error = signal<string | null>(null);
  loading = signal<boolean>(true);
  adding = signal<boolean>(false);

  constructor(private recipeService: RecipeService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchRecipes();
  }

  fetchRecipes(): void {
    this.loading.set(true);
    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        this.recipes.set(recipes);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load recipes.');
        this.loading.set(false);
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddRecipeDialogWrapperComponent, {
      width: '400px',
      data: {}
    });
    dialogRef.afterClosed().subscribe((result: Partial<Recipe> | null) => {
      if (result && result.title) {
        this.addRecipe(result);
      }
    });
  }

  addRecipe(recipe?: Partial<Recipe>): void {
    if (this.adding()) return;
    const recipeToAdd = recipe ?? { title: '', description: '', servings: 1, ingredients: [], instructions: '' };
    if (!recipeToAdd.title) return;
    this.adding.set(true);
    this.recipeService.createRecipe(recipeToAdd).subscribe({
      next: () => {
        this.fetchRecipes();
        this.adding.set(false);
      },
      error: () => {
        this.error.set('Failed to add recipe.');
        this.adding.set(false);
      }
    });
  }

  deleteRecipe(recipe: Recipe): void {
    this.loading.set(true);
    this.recipeService.deleteRecipe(recipe.id).subscribe({
      next: () => {
        this.recipes.set(this.recipes().filter(r => r.id !== recipe.id));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to delete recipe.');
        this.loading.set(false);
      }
    });
  }
}
