import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {ShoppingList, ShoppingListItem} from '../interfaces/shopping-list.model';
import {ApiResponse} from '../interfaces/api-response.model';

@Injectable({ providedIn: 'root' })
export class ShoppingItemService {
  private readonly baseUrl = `${environment.apiUrl}/shopping-item`;
  private readonly http = inject(HttpClient);

  getAll(): Observable<ShoppingListItem[]> {
    return this.http.get< ApiResponse<ShoppingListItem[]>> (this.baseUrl)
      .pipe(map(response => {
        return response.data?.item || []
      }));
  }

  create(list: Partial<ShoppingListItem>): Observable<ShoppingListItem> {
    return this.http.post<ShoppingListItem>(this.baseUrl, list);
  }

  getById(id: string): Observable<ShoppingListItem> {
    return this.http.get<ShoppingListItem>(`${this.baseUrl}/${id}`);
  }

  updateItem(id: string, list: Partial<ShoppingListItem>): Observable<ShoppingListItem> {
    return this.http.put<ShoppingListItem>(`${this.baseUrl}/${id}`, list);
  }

  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
