import { Injectable, inject, signal, computed } from '@angular/core';
import { RecipeService } from '../../../core/services/recipe.service';
import { Recipe } from '../../../core/interfaces/recipe.model';
import { firstValueFrom } from 'rxjs';
import { RecipeUtils } from '../utils/recipe.utils';

@Injectable({
  providedIn: 'root'
})
export class RecipeFacadeService {
  private readonly recipeService = inject(RecipeService);

  // Private writable signals
  private readonly _recipes = signal<Recipe[]>([]);
  private readonly _recipeLoading = signal<boolean>(false);
  private readonly _recipeError = signal<string | null>(null);
  private readonly _selectedTag = signal<string | null>(null);

  // Public readonly signals
  public readonly recipes = this._recipes.asReadonly();
  public readonly recipeLoading = this._recipeLoading.asReadonly();
  public readonly recipeError = this._recipeError.asReadonly();
  public readonly selectedTag = this._selectedTag.asReadonly();

  // Computed signals for derived state
  public readonly filteredRecipes = computed(() => {
    const allRecipes = this._recipes();
    const tagFilter = this._selectedTag();
    return RecipeUtils.filterByTag(allRecipes, tagFilter);
  });

  public readonly sortedRecipes = computed(() => {
    const filtered = this.filteredRecipes();
    return RecipeUtils.sortRecipes(filtered);
  });

  public readonly recipeTags = computed(() => {
    const allRecipes = this._recipes();
    return RecipeUtils.getUniqueTags(allRecipes);
  });

  /**
   * Load all recipes
   */
  public loadRecipes(): void {
    this._recipeLoading.set(true);
    this._recipeError.set(null);

    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        this._recipes.set(RecipeUtils.sortRecipes(recipes));
        this._recipeLoading.set(false);
      },
      error: () => {
        this._recipeError.set('Failed to load recipes.');
        this._recipeLoading.set(false);
      }
    });
  }

  /**
   * Add a new recipe with optimistic updates
   */
  public async addRecipe(recipeData: Partial<Recipe>): Promise<void> {
    const tempId = RecipeUtils.generateTempId();
    const optimisticRecipe = {
      ...RecipeUtils.createDefaultRecipe(),
      ...recipeData,
      id: tempId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Recipe;

    // Add optimistically
    this._recipes.update(recipes => [...recipes, optimisticRecipe]);

    try {
      const savedRecipe = await firstValueFrom(this.recipeService.createRecipe(recipeData));
      // Replace temp with real recipe
      this._recipes.update(recipes =>
        recipes.map(r => r.id === tempId ? savedRecipe : r)
      );
      this._recipeError.set(null);
    } catch (error) {
      // Remove optimistic recipe on error
      this._recipes.update(recipes => recipes.filter(r => r.id !== tempId));
      this._recipeError.set('Failed to add recipe.');
      throw error;
    }
  }

  /**
   * Update an existing recipe
   */
  public async updateRecipe(recipeId: string, recipeData: Partial<Recipe>): Promise<void> {
    // Store original for rollback
    const originalRecipes = this._recipes();

    // Update optimistically
    this._recipes.update(recipes =>
      recipes.map(r => r.id === recipeId ? { ...r, ...recipeData, updatedAt: new Date().toISOString() } : r)
    );

    try {
      const updatedRecipe = await firstValueFrom(this.recipeService.updateRecipe(recipeId, recipeData));
      // Replace with server response
      this._recipes.update(recipes =>
        recipes.map(r => r.id === recipeId ? updatedRecipe : r)
      );
      this._recipeError.set(null);
    } catch (error) {
      // Rollback on error
      this._recipes.set(originalRecipes);
      this._recipeError.set('Failed to update recipe.');
      throw error;
    }
  }

  /**
   * Delete a recipe
   */
  public async deleteRecipe(recipeId: string): Promise<void> {
    // Store original for rollback
    const originalRecipes = this._recipes();

    // Remove optimistically
    this._recipes.update(recipes => recipes.filter(r => r.id !== recipeId));

    try {
      await firstValueFrom(this.recipeService.deleteRecipe(recipeId));
      this._recipeError.set(null);
    } catch (error) {
      // Rollback on error
      this._recipes.set(originalRecipes);
      this._recipeError.set('Failed to delete recipe.');
      throw error;
    }
  }

  /**
   * Set tag filter
   */
  public setTagFilter(tag: string | null): void {
    this._selectedTag.set(tag);
  }

  /**
   * Clear all filters
   */
  public clearFilters(): void {
    this._selectedTag.set(null);
  }

  /**
   * Clear error state
   */
  public clearError(): void {
    this._recipeError.set(null);
  }
}
