import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface DashboardCardConfig {
  title: string;
  value: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard-summary-cards',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './dashboard-summary-cards.component.html',
  styleUrls: ['./dashboard-summary-cards.component.scss']
})
export class DashboardSummaryCardsComponent {
  @Input() cards: DashboardCardConfig[] = [];
}

