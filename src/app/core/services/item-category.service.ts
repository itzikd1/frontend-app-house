import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {TaskCategory} from '../interfaces/item-category.model';

@Injectable({ providedIn: 'root' })
export class TaskCategoryService {
  private readonly baseUrl = `${environment.apiUrl}/task-category`;
  private readonly http = inject(HttpClient);

  getAll(): Observable<TaskCategory[]> {
    return this.http.get<{ success: boolean; data: TaskCategory[] }>(this.baseUrl)
      .pipe(map(res => res.data ?? []));
  }

  create(category: Partial<TaskCategory>): Observable<TaskCategory> {
    return this.http.post<TaskCategory>(this.baseUrl, category);
  }

  update(id: string, category: Partial<TaskCategory>): Observable<TaskCategory> {
    return this.http.put<TaskCategory>(`${this.baseUrl}/${id}`, category);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
