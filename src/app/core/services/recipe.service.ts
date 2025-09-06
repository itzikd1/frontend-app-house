import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe, BackendRecipe } from '../interfaces/recipe.model';
import { environment } from '../../../environments/environment';

// Define the API response structure based on your actual API
interface ApiResponse<T> {
  data: {
    item?: T;
    success: boolean;
  };
  error?: string;
}

interface ApiListResponse {
  data: {
    item: BackendRecipe[];
    success: boolean;
  };
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly baseUrl = `${environment.apiUrl}/recipe`;
  private readonly http = inject(HttpClient);

  /**
   * Transform backend recipe to frontend format
   */
  private transformBackendToFrontend(backendRecipe: BackendRecipe): Recipe {
    return {
      id: backendRecipe.id,
      title: backendRecipe.title,
      ingredients: backendRecipe.ingredients, // Keep as string array from backend
      instructions: backendRecipe.instructions,
      createdAt: backendRecipe.createdAt,
      updatedAt: backendRecipe.updatedAt,
      createdById: backendRecipe.userId,
      userId: backendRecipe.userId,
      familyId: backendRecipe.familyId,
    };
  }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<ApiListResponse>(this.baseUrl).pipe(
      map(res => {
        if (res.error) throw new Error(res.error);
        const backendRecipes = res.data?.item ?? [];
        return backendRecipes.map(recipe => this.transformBackendToFrontend(recipe));
      })
    );
  }

  getRecipe(id: string): Observable<Recipe> {
    return this.http.get<ApiResponse<BackendRecipe>>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
        if (res.error) throw new Error(res.error);
        if (!res.data?.item) throw new Error('Recipe not found');
        return this.transformBackendToFrontend(res.data.item);
      })
    );
  }

  createRecipe(recipeData: any): Observable<Recipe> {
    // recipeData should already be in backend format from the dialog config transformation
    return this.http.post<ApiResponse<BackendRecipe>>(this.baseUrl, recipeData).pipe(
      map(res => {
        if (res.error) throw new Error(res.error);
        if (!res.data?.item) throw new Error('Failed to create recipe');
        return this.transformBackendToFrontend(res.data.item);
      })
    );
  }

  updateRecipe(id: string, recipeData: any): Observable<Recipe> {
    // recipeData should already be in backend format from the dialog config transformation
    return this.http.put<ApiResponse<BackendRecipe>>(`${this.baseUrl}/${id}`, recipeData).pipe(
      map(res => {
        if (res.error) throw new Error(res.error);
        if (!res.data?.item) throw new Error('Failed to update recipe');
        return this.transformBackendToFrontend(res.data.item);
      })
    );
  }

  deleteRecipe(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
        if (res.error) throw new Error(res.error);
        return;
      })
    );
  }
}
