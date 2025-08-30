import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Recipe } from '../../shared/models/recipe.model';
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
      }),
      catchError(err => throwError(() => err))
    );
  }

  getRecipe(id: string): Observable<Recipe> {
    return this.http.get<{ data?: Recipe; error?: string }>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as Recipe;
      }),
      catchError(err => throwError(() => err))
    );
  }

  createRecipe(recipe: Partial<Recipe>): Observable<Recipe> {
    return this.http.post<{ data?: Recipe; error?: string }>(this.baseUrl, recipe).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as Recipe;
      }),
      catchError(err => throwError(() => err))
    );
  }

  updateRecipe(id: string, recipe: Partial<Recipe>): Observable<Recipe> {
    return this.http.put<{ data?: Recipe; error?: string }>(`${this.baseUrl}/${id}`, recipe).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as Recipe;
      }),
      catchError(err => throwError(() => err))
    );
  }

  deleteRecipe(id: string): Observable<void> {
    return this.http.delete<{ data?: void; error?: string }>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data;
      }),
      catchError(err => throwError(() => err))
    );
  }
}
