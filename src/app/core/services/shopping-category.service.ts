import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

export interface ShoppingCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ShoppingCategoryService {
  private readonly baseUrl = `${environment.apiUrl}/shopping-category`;
  private readonly http = inject(HttpClient);

  getAll(): Observable<ShoppingCategory[]> {
    return this.http.get<{ success: boolean; data: ShoppingCategory[] }>(this.baseUrl)
      .pipe(map(response => response.data));
  }

  create(category: Partial<ShoppingCategory>): Observable<ShoppingCategory> {
    return this.http.post<ShoppingCategory>(this.baseUrl, category);
  }

  update(id: string, category: Partial<ShoppingCategory>): Observable<ShoppingCategory> {
    return this.http.put<ShoppingCategory>(`${this.baseUrl}/${id}`, category);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
