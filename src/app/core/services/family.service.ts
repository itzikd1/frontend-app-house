import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Family } from '../interfaces/family.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FamilyService {
  private readonly baseUrl = `${environment.apiUrl}/families`;
  private readonly http = inject(HttpClient);

  getFamilies(): Observable<Family[]> {
    return this.http.get<{ data?: Family[]; error?: string }>(this.baseUrl).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data ?? [];
      })
    );
  }

  getFamily(id: string): Observable<Family> {
    return this.http.get<{ data?: Family; error?: string }>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as Family;
      })
    );
  }

  createFamily(family: Partial<Family>): Observable<Family> {
    return this.http.post<{ data?: Family; error?: string }>(this.baseUrl, family).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as Family;
      })
    );
  }

  updateFamily(id: string, family: Partial<Family>): Observable<Family> {
    return this.http.put<{ data?: Family; error?: string }>(`${this.baseUrl}/${id}`, family).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as Family;
      })
    );
  }

  deleteFamily(id: string): Observable<void> {
    return this.http.delete<{ data?: void; error?: string }>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data;
      })
    );
  }
}
