export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

// Backend Recipe format (what API returns)
export interface BackendRecipe {
  id: string;
  title: string;
  ingredients: string[];  // Array of ingredient names as strings
  instructions: string;   // Instructions as a single string
  userId: string;
  familyId?: string;
  createdAt: string;
  updatedAt: string;
}

// Frontend Recipe format (for display and editing)
export interface Recipe extends BaseModel {
  title: string;
  description?: string;
  ingredients: Ingredient[] | string[];  // Support both formats
  instructions: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  tags?: string[];
  createdById: string;
  userId?: string;    // Backend field
  familyId?: string;  // Backend field
}

export {}
