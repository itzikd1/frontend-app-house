import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface DashboardCardConfig {
  title: string;
  value: number;
  icon: string;
  color: string;
  filter: 'all' | 'overdue' | 'complete' | 'uncomplete';
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
  @Input() activeFilter: 'all' | 'overdue' | 'complete' | 'uncomplete' = 'all';
  @Output() cardClick = new EventEmitter<'all' | 'overdue' | 'complete' | 'uncomplete'>();

  onCardClick(filter: 'all' | 'overdue' | 'complete' | 'uncomplete'): void {
    this.cardClick.emit(filter);
  }
}
