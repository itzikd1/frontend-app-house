import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe } from '../interfaces/recipe.model';
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
    item: Recipe[];
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

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<ApiListResponse>(this.baseUrl).pipe(
      map(res => {
        if (res.error) throw new Error(res.error);
        return res.data?.item ?? [];
      })
    );
  }

  getRecipe(id: string): Observable<Recipe> {
    return this.http.get<ApiResponse<Recipe>>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
        if (res.error) throw new Error(res.error);
        if (!res.data?.item) throw new Error('Recipe not found');
        return res.data.item;
      })
    );
  }

  createRecipe(recipe: Partial<Recipe>): Observable<Recipe> {
    return this.http.post<ApiResponse<Recipe>>(this.baseUrl, recipe).pipe(
      map(res => {
        if (res.error) throw new Error(res.error);
        if (!res.data?.item) throw new Error('Failed to create recipe');
        return res.data.item;
      })
    );
  }

  updateRecipe(id: string, recipe: Partial<Recipe>): Observable<Recipe> {
    return this.http.put<ApiResponse<Recipe>>(`${this.baseUrl}/${id}`, recipe).pipe(
      map(res => {
        if (res.error) throw new Error(res.error);
        if (!res.data?.item) throw new Error('Failed to update recipe');
        return res.data.item;
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
