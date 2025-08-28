import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { RecipeService } from '../../core/services/recipe.service';
import { Recipe } from '../../shared/models/recipe.model';
import { CommonModule } from '@angular/common';
import { ItemListComponent } from '../../shared/components/item-list/item-list.component';
import { FabButtonComponent } from '../../shared/components/fab-button/fab-button.component';
import { ItemCardComponent } from '../../shared/components/item-card/item-card.component';
import { ItemDialogComponent } from '../../shared/components/item-dialog/item-dialog.component';
import { ItemFormComponent } from '../../shared/components/item-form/item-form.component';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ItemListComponent,
    FabButtonComponent,
    ItemCardComponent,
    ItemDialogComponent,
    ItemFormComponent,
    LoadingSpinnerComponent,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipesComponent implements OnInit {
  recipes = signal<Recipe[]>([]);
  error = signal<string | null>(null);
  loading = signal<boolean>(true);
  showDialog = signal<boolean>(false);
  adding = signal<boolean>(false);
  newRecipe = signal<Partial<Recipe>>({ title: '', description: '', servings: 1 });

  constructor(private recipeService: RecipeService) {}

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
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.newRecipe.set({ title: '', description: '', servings: 1 });
  }

  addRecipe(): void {
    if (!this.newRecipe().title) return;
    this.adding.set(true);
    this.recipeService.createRecipe(this.newRecipe()).subscribe({
      next: (recipe) => {
        this.recipes.set([recipe, ...this.recipes()]);
        this.closeDialog();
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
