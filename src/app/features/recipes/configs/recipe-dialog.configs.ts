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
          key: 'description',
          label: 'Description',
          type: 'textarea',
          required: false,
          validators: [Validators.maxLength(500)],
          placeholder: 'Brief description of the recipe'
        },
        {
          key: 'servings',
          label: 'Servings',
          type: 'number',
          required: false,
          validators: [Validators.min(1), Validators.max(50)],
          placeholder: 'Number of servings'
        },
        {
          key: 'prepTime',
          label: 'Prep Time (minutes)',
          type: 'number',
          required: false,
          validators: [Validators.min(0), Validators.max(1440)],
          placeholder: 'Preparation time in minutes'
        },
        {
          key: 'cookTime',
          label: 'Cook Time (minutes)',
          type: 'number',
          required: false,
          validators: [Validators.min(0), Validators.max(1440)],
          placeholder: 'Cooking time in minutes'
        },
        {
          key: 'ingredientsInput',
          label: 'Ingredients',
          type: 'textarea',
          required: false,
          placeholder: 'Enter ingredients separated by commas (e.g., 2 cups flour, 1 tsp salt)'
        },
        {
          key: 'instructions',
          label: 'Instructions',
          type: 'textarea',
          required: true,
          validators: [Validators.required, Validators.minLength(10)],
          placeholder: 'Step-by-step cooking instructions'
        },
        {
          key: 'tagsInput',
          label: 'Tags',
          type: 'text',
          required: false,
          placeholder: 'Enter tags separated by commas (e.g., dinner, vegetarian, quick)'
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
        description: recipe.description || '',
        servings: recipe.servings || RecipeUtils.DEFAULT_SERVINGS,
        prepTime: recipe.prepTime || '',
        cookTime: recipe.cookTime || '',
        ingredientsInput: RecipeUtils.ingredientsToString(recipe.ingredients),
        instructions: recipe.instructions,
        tagsInput: recipe.tags ? recipe.tags.join(', ') : ''
      }
    };
  }

  /**
   * Transform form data to recipe data
   */
  static transformFormDataToRecipe(formData: any): Partial<Recipe> {
    const recipe: Partial<Recipe> = {
      title: formData.title,
      description: formData.description || undefined,
      servings: formData.servings || RecipeUtils.DEFAULT_SERVINGS,
      prepTime: formData.prepTime || undefined,
      cookTime: formData.cookTime || undefined,
      instructions: formData.instructions,
    };

    // Parse ingredients from comma-separated string
    if (formData.ingredientsInput) {
      recipe.ingredients = RecipeUtils.parseIngredientsFromString(formData.ingredientsInput);
    } else {
      recipe.ingredients = [];
    }

    // Parse tags from comma-separated string
    if (formData.tagsInput) {
      recipe.tags = formData.tagsInput
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);
    } else {
      recipe.tags = [];
    }

    return recipe;
  }
}
