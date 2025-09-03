import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe } from '../interfaces/recipe.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly baseUrl = `${environment.apiUrl}/recipe`;
  private readonly http = inject(HttpClient);

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<{ data?: Recipe[]; error?: string }>(this.baseUrl).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data ?? [];
      })
    );
  }

  getRecipe(id: string): Observable<Recipe> {
    return this.http.get<{ data?: Recipe; error?: string }>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as Recipe;
      })
    );
  }

  createRecipe(recipe: Partial<Recipe>): Observable<Recipe> {
    return this.http.post<{ data?: Recipe; error?: string }>(this.baseUrl, recipe).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as Recipe;
      })
    );
  }

  updateRecipe(id: string, recipe: Partial<Recipe>): Observable<Recipe> {
    return this.http.put<{ data?: Recipe; error?: string }>(`${this.baseUrl}/${id}`, recipe).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as Recipe;
      })
    );
  }

  deleteRecipe(id: string): Observable<void> {
    return this.http.delete<{ data?: void; error?: string }>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data;
      })
    );
  }
}
