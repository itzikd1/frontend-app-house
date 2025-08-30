import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {HealthStatus} from '../interfaces/health.model';

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/health`;

  getHealthStatus(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>(this.baseUrl);
  }
}
