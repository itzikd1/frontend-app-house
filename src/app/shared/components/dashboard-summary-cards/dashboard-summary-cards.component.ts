import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DashboardCardFilter } from '../../models/dashboard-card-filter.model';

export interface DashboardCardConfig {
  title: string;
  value: number;
  icon: string;
  color: string;
  filter: DashboardCardFilter;
}

@Component({
  selector: 'app-dashboard-summary-cards',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './dashboard-summary-cards.component.html',
  styleUrls: ['./dashboard-summary-cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardSummaryCardsComponent {
  @Input() cards: DashboardCardConfig[] = [];
  @Input() activeFilter: DashboardCardFilter = DashboardCardFilter.All;
  @Output() cardClick = new EventEmitter<DashboardCardFilter>();

  onCardClick(filter: DashboardCardFilter): void {
    this.cardClick.emit(filter);
  }
}
