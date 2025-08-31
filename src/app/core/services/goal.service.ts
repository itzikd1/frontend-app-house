import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { Goal } from '../interfaces/goal.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  private readonly baseUrl = `${environment.apiUrl}/goal`;
  private readonly http = inject(HttpClient);

  getGoals(): Observable<Goal[]> {
    return this.http.get<{ data?: { goals?: Goal[]; success?: boolean }; error?: string }>(this.baseUrl).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data?.goals ?? [];
      })
    );
  }

  getGoal(id: string): Observable<Goal> {
    return this.http.get<{ data?: Goal; error?: string }>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
        if (res.error) throw res.error;
        if (!res.data) throw 'Goal not found';
        return res.data;
      })
    );
  }

  createGoal(goal: Partial<Goal>): Observable<Goal> {
    return this.http.post<{ data?: Goal; error?: string }>(this.baseUrl, goal).pipe(
      map(res => {
        if (res.error) throw res.error;
        if (!res.data) throw 'Failed to create goal';
        return res.data;
      })
    );
  }

  updateGoal(id: string, goal: Partial<Goal>): Observable<Goal> {
    return this.http.put<{ data?: Goal; error?: string }>(`${this.baseUrl}/${id}`, goal).pipe(
      map(res => {
        if (res.error) throw res.error;
        if (!res.data) throw 'Failed to update goal';
        return res.data;
      })
    );
  }

  deleteGoal(id: string): Observable<void> {
    return this.http.delete<{ error?: string }>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
        if (res.error) throw res.error;
        return;
      })
    );
  }
}
