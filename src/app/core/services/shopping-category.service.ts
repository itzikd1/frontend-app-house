import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ShoppingCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ShoppingCategoryService {
  private readonly baseUrl = `${environment.apiUrl}/shopping-category`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ShoppingCategory[]> {
    return this.http.get<ShoppingCategory[]>(this.baseUrl);
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

