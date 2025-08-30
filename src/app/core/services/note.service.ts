import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {environment} from '../../../environments/environment';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class NoteService {
  private readonly baseUrl = `${environment.apiUrl}/note`;
  private readonly http = inject(HttpClient);

  getAll(): Observable<Note[]> {
    return this.http.get<{ data?: { success: boolean; notes: Note[] }; error?: string }>(this.baseUrl).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data?.notes ?? [];
      }),
      catchError(err => throwError(() => err))
    );
  }

  create(note: Partial<Note>): Observable<Note> {
    return this.http.post<Note>(this.baseUrl, note);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getById(id: string): Observable<Note> {
    return this.http.get<Note>(`${this.baseUrl}/${id}`);
  }

  update(id: string, note: Partial<Note>): Observable<Note> {
    return this.http.put<Note>(`${this.baseUrl}/${id}`, note);
  }
}
