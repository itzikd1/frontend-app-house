import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SavedShoppingList, SavedShoppingListItem } from '../../interfaces/saved-shopping-list.model';

@Injectable({ providedIn: 'root' })
export class SavedShoppingListService {
  private readonly baseUrl = `${environment.apiUrl}/saved-shopping-list`;
  private readonly http = inject(HttpClient);

  getAll(): Observable<SavedShoppingList[]> {
    return this.http.get<SavedShoppingList[]>(this.baseUrl);
  }

  create(list: Partial<SavedShoppingList>): Observable<SavedShoppingList> {
    return this.http.post<SavedShoppingList>(this.baseUrl, list);
  }

  getById(id: string): Observable<SavedShoppingList> {
    return this.http.get<SavedShoppingList>(`${this.baseUrl}/${id}`);
  }

  update(id: string, list: Partial<SavedShoppingList>): Observable<SavedShoppingList> {
    return this.http.put<SavedShoppingList>(`${this.baseUrl}/${id}`, list);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getItems(listId: string): Observable<SavedShoppingListItem[]> {
    return this.http.get<SavedShoppingListItem[]>(`${this.baseUrl}/${listId}/items`);
  }

  addItem(listId: string, item: Partial<SavedShoppingListItem>): Observable<SavedShoppingListItem> {
    return this.http.post<SavedShoppingListItem>(`${this.baseUrl}/${listId}/items`, item);
  }

  updateItem(itemId: string, item: Partial<SavedShoppingListItem>): Observable<SavedShoppingListItem> {
    return this.http.put<SavedShoppingListItem>(`${this.baseUrl}/items/${itemId}`, item);
  }

  deleteItem(itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/items/${itemId}`);
  }
}
