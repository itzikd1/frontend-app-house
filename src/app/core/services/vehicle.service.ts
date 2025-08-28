import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Car } from '../../shared/models/car.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private readonly baseUrl = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<Car[]> {
    return this.http.get<{ data?: Car[]; error?: string }>(this.baseUrl).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data ?? [];
      }),
      catchError(err => throwError(() => err))
    );
  }

  getVehicle(id: string): Observable<Car> {
    return this.http.get<{ data?: Car; error?: string }>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as Car;
      }),
      catchError(err => throwError(() => err))
    );
  }

  createVehicle(vehicle: Partial<Car>): Observable<Car> {
    return this.http.post<{ data?: Car; error?: string }>(this.baseUrl, vehicle).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as Car;
      }),
      catchError(err => throwError(() => err))
    );
  }

  updateVehicle(id: string, vehicle: Partial<Car>): Observable<Car> {
    return this.http.put<{ data?: Car; error?: string }>(`${this.baseUrl}/${id}`, vehicle).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as Car;
      }),
      catchError(err => throwError(() => err))
    );
  }

  deleteVehicle(id: string): Observable<void> {
    return this.http.delete<{ data?: void; error?: string }>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data;
      }),
      catchError(err => throwError(() => err))
    );
  }
}
