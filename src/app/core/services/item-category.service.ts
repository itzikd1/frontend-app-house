import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TaskCategory } from '../interfaces/item-category.model';
import { ApiResponse } from '../interfaces/api-response.model';

@Injectable({ providedIn: 'root' })
export class TaskCategoryService {
  private readonly baseUrl = `${environment.apiUrl}/task-category`;
  private readonly http = inject(HttpClient);

  getAll(): Observable<TaskCategory[]> {
    return this.http.get<ApiResponse<TaskCategory[]>>(this.baseUrl)
      .pipe(map(res => res.data?.item as TaskCategory[] ?? []));
  }

  create(category: Partial<TaskCategory>): Observable<ApiResponse<TaskCategory>> {
    return this.http.post<ApiResponse<TaskCategory>>(this.baseUrl, category);
  }

  update(id: string, category: Partial<TaskCategory>): Observable<ApiResponse<TaskCategory>> {
    return this.http.put<ApiResponse<TaskCategory>>(`${this.baseUrl}/${id}`, category);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
