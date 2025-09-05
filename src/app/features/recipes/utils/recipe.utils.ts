import { Recipe, Ingredient } from '../../../core/interfaces/recipe.model';

export class RecipeUtils {
  // Constants for maintainability
  public static readonly TEMP_ID_PREFIX = 'temp_' as const;
  public static readonly DEFAULT_SERVINGS = 1;

  /**
   * Generate a temporary ID for optimistic updates
   */
  public static generateTempId(): string {
    return `${this.TEMP_ID_PREFIX}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if a recipe ID is temporary
   */
  public static isTempId(id: string): boolean {
    return id.startsWith(this.TEMP_ID_PREFIX);
  }

  /**
   * Create a default recipe object
   */
  public static createDefaultRecipe(): Partial<Recipe> {
    return {
      title: '',
      description: '',
      ingredients: [],
      instructions: '',
      servings: this.DEFAULT_SERVINGS,
      tags: [],
    };
  }

  /**
   * Sort recipes by creation date (newest first)
   */
  public static sortRecipes(recipes: readonly Recipe[]): Recipe[] {
    return [...recipes].sort((a, b) => {
      // Put temp recipes at the top
      if (this.isTempId(a.id) && !this.isTempId(b.id)) return -1;
      if (!this.isTempId(a.id) && this.isTempId(b.id)) return 1;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  /**
   * Filter recipes by tag
   */
  public static filterByTag(recipes: readonly Recipe[], tag: string | null): Recipe[] {
    if (!tag) {
      return [...recipes];
    }

    return recipes.filter(recipe =>
      recipe.tags && recipe.tags.includes(tag)
    );
  }

  /**
   * Get unique tags from all recipes
   */
  public static getUniqueTags(recipes: readonly Recipe[]): string[] {
    const allTags = recipes
      .filter(recipe => recipe.tags && recipe.tags.length > 0)
      .flatMap(recipe => recipe.tags!);

    return [...new Set(allTags)].sort();
  }

  /**
   * Calculate total cooking time (prep + cook time)
   */
  public static getTotalCookTime(recipe: Recipe): number | null {
    if (!recipe.prepTime && !recipe.cookTime) {
      return null;
    }

    return (recipe.prepTime || 0) + (recipe.cookTime || 0);
  }

  /**
   * Format cooking time for display
   */
  public static formatCookTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
  }

  /**
   * Parse ingredients from comma-separated string
   */
  public static parseIngredientsFromString(ingredientsString: string): Ingredient[] {
    if (!ingredientsString.trim()) {
      return [];
    }

    return ingredientsString
      .split(',')
      .map(ingredient => ingredient.trim())
      .filter(ingredient => ingredient.length > 0)
      .map(ingredient => ({
        name: ingredient,
        amount: 1,
        unit: '',
      }));
  }

  /**
   * Convert ingredients to comma-separated string
   */
  public static ingredientsToString(ingredients: Ingredient[]): string {
    return ingredients
      .map(ingredient => {
        if (ingredient.amount && ingredient.unit) {
          return `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`;
        } else if (ingredient.amount) {
          return `${ingredient.amount} ${ingredient.name}`;
        }
        return ingredient.name;
      })
      .join(', ');
  }

  /**
   * Get ingredients preview string for display
   */
  public static getIngredientsPreview(ingredients: Ingredient[], maxItems: number = 3): string {
    if (!ingredients || ingredients.length === 0) {
      return 'No ingredients';
    }

    const preview = ingredients
      .slice(0, maxItems)
      .map(ingredient => ingredient.name)
      .join(', ');

    return ingredients.length > maxItems ? `${preview}...` : preview;
  }

  /**
   * Validate recipe data
   */
  public static validateRecipe(recipe: Partial<Recipe>): string[] {
    const errors: string[] = [];

    if (!recipe.title || recipe.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (recipe.title && recipe.title.length > 200) {
      errors.push('Title must be less than 200 characters');
    }

    if (recipe.servings && recipe.servings < 1) {
      errors.push('Servings must be at least 1');
    }

    if (recipe.prepTime && recipe.prepTime < 0) {
      errors.push('Prep time cannot be negative');
    }

    if (recipe.cookTime && recipe.cookTime < 0) {
      errors.push('Cook time cannot be negative');
    }

    return errors;
  }
}
