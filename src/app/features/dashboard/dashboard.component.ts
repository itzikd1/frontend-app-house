import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthService, HealthStatus } from '../../core/services/health.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  healthStatus: HealthStatus | null = null;
  error: string | null = null;
  loading = true;

  private readonly healthService = inject(HealthService);

  ngOnInit(): void {
    this.healthService.getHealthStatus()
      .pipe(
        catchError(err => {
          this.error = 'Failed to load health status';
          this.loading = false;
          console.error('Health check failed:', err);
          return of(null);
        })
      )
      .subscribe(status => {
        this.healthStatus = status;
        this.loading = false;
      });
  }
}
