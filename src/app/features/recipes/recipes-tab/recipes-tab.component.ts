import {Component, ChangeDetectionStrategy, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {RecipeFacadeService} from '../services/recipe-facade.service';
import {FormDialogService} from '../../../shared/services/form-dialog.service';
import {RecipeDialogConfigs} from '../configs/recipe-dialog.configs';
import {Recipe, Ingredient} from '../../../core/interfaces/recipe.model';
import {RecipeUtils} from '../utils/recipe.utils';
import {ItemCardComponent} from '../../../shared/components/item-card/item-card.component';
import {LoadingSpinnerComponent} from '../../../shared/components/loading-spinner/loading-spinner.component';
import {FabButtonComponent} from '../../../shared/components/fab-button/fab-button.component';
import {RecipeTagFilterComponent} from '../recipe-tag-filter/recipe-tag-filter.component';

@Component({
  selector: 'app-recipes-tab',
  standalone: true,
  imports: [
    CommonModule,
    ItemCardComponent,
    LoadingSpinnerComponent,
    FabButtonComponent,
    RecipeTagFilterComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './recipes-tab.component.html',
  styleUrl: './recipes-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipesTabComponent {
  private readonly recipeFacade = inject(RecipeFacadeService);
  private readonly formDialogService = inject(FormDialogService);

  // Expose facade signals directly
  public readonly recipes = this.recipeFacade.sortedRecipes;
  public readonly loading = this.recipeFacade.recipeLoading;
  public readonly error = this.recipeFacade.recipeError;
  public readonly selectedTag = this.recipeFacade.selectedTag;
  public readonly availableTags = this.recipeFacade.recipeTags;

  /**
   * Open dialog to add new recipe
   */
  public openAddRecipeDialog(): void {
    const config = RecipeDialogConfigs.createAddRecipeConfig();

    this.formDialogService.openFormDialog(config).subscribe(result => {
      if (result) {
        const recipeData = RecipeDialogConfigs.transformFormDataToRecipe(result);
        this.recipeFacade.addRecipe(recipeData);
      }
    });
  }

  /**
   * Open dialog to edit recipe
   */
  public openEditRecipeDialog(recipe: Recipe): void {
    const config = RecipeDialogConfigs.createEditRecipeConfig(recipe);

    this.formDialogService.openFormDialog(config).subscribe(result => {
      if (result) {
        const recipeData = RecipeDialogConfigs.transformFormDataToRecipe(result);
        this.recipeFacade.updateRecipe(recipe.id, recipeData);
      }
    });
  }

  /**
   * Delete recipe
   */
  public deleteRecipe(recipe: Recipe): void {
    this.recipeFacade.deleteRecipe(recipe.id);
  }

  /**
   * Check if recipe is temporary (optimistic update)
   */
  public isTemporaryRecipe(recipe: Recipe): boolean {
    return RecipeUtils.isTempId(recipe.id);
  }

  /**
   * Get formatted total cook time
   */
  public getFormattedCookTime(recipe: Recipe): string | null {
    const totalTime = RecipeUtils.getTotalCookTime(recipe);
    return totalTime ? RecipeUtils.formatCookTime(totalTime) : null;
  }

  /**
   * Handle tag filter change
   */
  public onTagFilterChange(tag: string | null): void {
    this.recipeFacade.setTagFilter(tag);
  }

  /**
   * Clear error state
   */
  public clearError(): void {
    this.recipeFacade.clearError();
  }

  /**
   * Track function for recipe list performance
   */
  public trackByRecipeId(index: number, recipe: Recipe): string {
    return recipe.id;
  }

  /**
   * Get ingredients preview for display
   */
  public getIngredientsPreview(ingredients: Ingredient[] | string[]): string {
    return RecipeUtils.getIngredientsPreview(ingredients);
  }
}
