import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HealthStatus} from '../../../core/interfaces/health.model';

@Component({
  selector: 'app-health-status-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health-status-card.component.html',
  styleUrls: ['./health-status-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthStatusCardComponent {
  @Input() healthStatus!: HealthStatus;
}

