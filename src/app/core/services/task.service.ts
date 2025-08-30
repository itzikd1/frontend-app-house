import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Task } from '../../shared/models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly baseUrl = `${environment.apiUrl}/tasks`;
  private readonly http = inject(HttpClient);

  getTasks(): Observable<Task[]> {
    return this.http.get<{ data?: { tasks?: Task[]; error?: string } }>(this.baseUrl).pipe(
      map(res => {
        if (res.data?.error) throw res.data.error;
        return res.data?.tasks ?? [];
      }),
      catchError(err => throwError(() => err))
    );
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<{ data?: Task; error?: string }>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as Task;
      }),
      catchError(err => throwError(() => err))
    );
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<{ data?: Task; error?: string }>(this.baseUrl, task).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as Task;
      }),
      catchError(err => throwError(() => err))
    );
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<{ data?: Task; error?: string }>(`${this.baseUrl}/${id}`, task).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as Task;
      }),
      catchError(err => throwError(() => err))
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<{ data?: void; error?: string }>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data;
      }),
      catchError(err => throwError(() => err))
    );
  }
}
