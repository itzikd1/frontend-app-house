import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface HealthStatus {
  status: string;
  version: string;
  timestamp: string;
  environment: string;
}

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private readonly baseUrl = `${environment.apiUrl}/health`;

  constructor(private http: HttpClient) { }

  getHealthStatus(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>(this.baseUrl);
  }
}
