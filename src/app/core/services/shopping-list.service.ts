import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  checked: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  private readonly baseUrl = `${environment.apiUrl}/shopping-list`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(this.baseUrl);
  }

  create(list: Partial<ShoppingList>): Observable<ShoppingList> {
    return this.http.post<ShoppingList>(this.baseUrl, list);
  }

  getById(id: string): Observable<ShoppingList> {
    return this.http.get<ShoppingList>(`${this.baseUrl}/${id}`);
  }

  update(id: string, list: Partial<ShoppingList>): Observable<ShoppingList> {
    return this.http.put<ShoppingList>(`${this.baseUrl}/${id}`, list);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  addItem(listId: string, item: Partial<ShoppingListItem>): Observable<ShoppingListItem> {
    return this.http.post<ShoppingListItem>(`${this.baseUrl}/${listId}/items`, item);
  }

  updateItem(itemId: string, item: Partial<ShoppingListItem>): Observable<ShoppingListItem> {
    return this.http.put<ShoppingListItem>(`${this.baseUrl}/items/${itemId}`, item);
  }

  deleteItem(itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/items/${itemId}`);
  }
}

