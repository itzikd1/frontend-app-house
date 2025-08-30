import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthService } from '../../core/services/health.service';
import { catchError, of, Subscription } from 'rxjs';
import { HealthStatusCardComponent } from '../../shared/components/health-status-card/health-status-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { signal } from '@angular/core';
import {HealthStatus} from '../../core/interfaces/health.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    HealthStatusCardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  public healthStatus = signal<HealthStatus | null>(null);
  public error = signal<string | null>(null);
  public loading = signal<boolean>(true);

  private readonly healthService = inject(HealthService);
  private subscription: Subscription | null = null;

  public ngOnInit(): void {
    this.loadHealthStatus();
  }

  public loadHealthStatus(): void {
    this.loading.set(true);
    this.error.set(null);
    this.healthStatus.set(null);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.healthService.getHealthStatus()
      .pipe(
        catchError(() => {
          this.error.set('Failed to load health status');
          this.loading.set(false);
          return of(null);
        })
      )
      .subscribe((status) => {
        this.healthStatus.set(status);
        this.loading.set(false);
      });
  }

  public retry(): void {
    this.loadHealthStatus();
  }
}
