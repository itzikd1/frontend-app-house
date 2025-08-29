import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TaskCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class TaskCategoryService {
  private readonly baseUrl = `${environment.apiUrl}/category`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TaskCategory[]> {
    return this.http.get<TaskCategory[]>(this.baseUrl);
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
