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

export interface Recipe extends BaseModel {
  title: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  tags?: string[];
  createdById: string;
}

export {}
