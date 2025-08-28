import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  private readonly baseUrl = `${environment.apiUrl}/cars`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Car[]> {
    return this.http.get<Car[]>(this.baseUrl);
  }
}

