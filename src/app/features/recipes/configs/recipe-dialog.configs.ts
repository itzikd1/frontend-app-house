import { FormDialogConfig } from '../../../shared/components/form-dialog.component';
import { Validators } from '@angular/forms';
import { Recipe } from '../../../core/interfaces/recipe.model';
import { RecipeUtils } from '../utils/recipe.utils';

export class RecipeDialogConfigs {
  /**
   * Create configuration for adding a new recipe
   */
  static createAddRecipeConfig(): FormDialogConfig {
    return {
      title: 'Add New Recipe',
      submitLabel: 'Add Recipe',
      fields: [
        {
          key: 'title',
          label: 'Title',
          type: 'text',
          required: true,
          validators: [Validators.required, Validators.minLength(1), Validators.maxLength(200)],
          placeholder: 'Enter recipe title'
        },
        {
          key: 'ingredientsInput',
          label: 'Ingredients',
          type: 'textarea',
          required: true,
          validators: [Validators.required],
          placeholder: 'Enter ingredients, one per line (e.g.:\n2 cups flour\n1 tsp salt\n3 eggs)'
        },
        {
          key: 'instructions',
          label: 'Instructions',
          type: 'textarea',
          required: true,
          validators: [Validators.required, Validators.minLength(10)],
          placeholder: 'Step-by-step cooking instructions'
        }
      ]
    };
  }

  /**
   * Create configuration for editing an existing recipe
   */
  static createEditRecipeConfig(recipe: Recipe): FormDialogConfig {
    const config = this.createAddRecipeConfig();

    return {
      ...config,
      title: 'Edit Recipe',
      submitLabel: 'Update Recipe',
      initialData: {
        title: recipe.title,
        ingredientsInput: RecipeUtils.ingredientsToString(recipe.ingredients),
        instructions: recipe.instructions
      }
    };
  }

  /**
   * Transform form data to backend-compatible recipe data
   */
  static transformFormDataToRecipe(formData: any): any {
    // Transform to match backend expectations
    const backendData = {
      title: formData.title,
      ingredients: RecipeUtils.parseIngredientsToBackendFormat(formData.ingredientsInput),
      instructions: formData.instructions
    };

    return backendData;
  }
}
