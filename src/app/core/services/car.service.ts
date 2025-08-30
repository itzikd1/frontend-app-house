import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {environment} from '../../../environments/environment';

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class CarService {
  private readonly baseUrl = `${environment.apiUrl}/car`;
  private readonly http = inject(HttpClient);

  getAll(): Observable<Car[]> {
    return this.http.get<{ data?: { success: boolean; cars: Car[] }; error?: string }>(this.baseUrl).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data?.cars ?? [];
      }),
      catchError(err => throwError(() => err))
    );
  }

  create(car: Partial<Car>): Observable<Car> {
    return this.http.post<Car>(this.baseUrl, car);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getById(id: string): Observable<Car> {
    return this.http.get<Car>(`${this.baseUrl}/${id}`);
  }

  update(id: string, car: Partial<Car>): Observable<Car> {
    return this.http.put<Car>(`${this.baseUrl}/${id}`, car);
  }
}
