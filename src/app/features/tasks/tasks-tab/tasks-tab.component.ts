import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Task } from '../../../core/interfaces/task.model';
import { TaskCategory } from '../../../core/interfaces/item-category.model';
import { DashboardCardConfig } from '../../../shared/components/dashboard-summary-cards/dashboard-summary-cards.component';
import { DashboardCardFilter } from '../../../shared/models/dashboard-card-filter.model';
import {CommonModule} from '@angular/common';
import {LoadingSpinnerComponent} from '../../../shared/components/loading-spinner/loading-spinner.component';
import {ItemCardComponent} from '../../../shared/components/item-card/item-card.component';
import { MatIconModule } from '@angular/material/icon';
import { DashboardSummaryCardsComponent } from '../../../shared/components/dashboard-summary-cards/dashboard-summary-cards.component';

@Component({
  selector: 'app-tasks-tab',
  templateUrl: './tasks-tab.component.html',
  styleUrls: ['./tasks-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LoadingSpinnerComponent, ItemCardComponent, MatIconModule, DashboardSummaryCardsComponent],
  standalone: true,
})
export class TasksTabComponent {
  @Input() tasks: Task[] = [];
  @Input() filteredTasks: Task[] = [];
  @Input() categories: TaskCategory[] = [];
  @Input() selectedCategory = '';
  @Input() dashboardCards: DashboardCardConfig[] = [];
  @Input() dashboardFilter!: DashboardCardFilter;
  @Input() loading = false;
  @Input() error: string | null = null;

  @Output() setCategory = new EventEmitter<string>();
  @Output() setDashboardFilter = new EventEmitter<DashboardCardFilter>();
  @Output() onToggleComplete = new EventEmitter<{task: Task, completed: boolean}>();
  @Output() startEdit = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<string>();

  isOverdue(dueDate: string | Date): boolean {
    const date = new Date(dueDate);
    const now = new Date();
    return date < now;
  }
}
