import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RecipeService } from '../../core/services/recipe.service';
import { Observable } from 'rxjs';
import { Recipe } from '../../shared/models/recipe.model';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipesComponent {
  recipes: Recipe[] = [];
  error: string | null = null;
  loading = true;

  constructor(private recipeService: RecipeService) {
    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.loading = false;
        if (!recipes || recipes.length === 0) {
          this.error = 'No recipes found or failed to load recipes.';
        }
      },
      error: () => {
        this.error = 'Failed to load recipes.';
        this.loading = false;
      }
    });
  }
}
