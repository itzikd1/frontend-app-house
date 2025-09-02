import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, inject, Signal } from '@angular/core';
import { Task } from '../../../core/interfaces/task.model';
import { TaskCategory } from '../../../core/interfaces/item-category.model';
import { DashboardCardConfig } from '../../../shared/components/dashboard-summary-cards/dashboard-summary-cards.component';
import { DashboardCardFilter } from '../../../shared/models/dashboard-card-filter.model';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ItemCardComponent } from '../../../shared/components/item-card/item-card.component';
import { MatIconModule } from '@angular/material/icon';
import { DashboardSummaryCardsComponent } from '../../../shared/components/dashboard-summary-cards/dashboard-summary-cards.component';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogWrapperComponent } from '../dialogs/add-task-dialog-wrapper.component';
import {TabSwitcherComponent} from '../../../shared/components/tab-switcher/tab-switcher.component';

@Component({
  selector: 'app-tasks-tab',
  templateUrl: './tasks-tab.component.html',
  styleUrls: ['./tasks-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    ItemCardComponent,
    MatIconModule,
    DashboardSummaryCardsComponent,
    TabSwitcherComponent,
  ],
  standalone: true,
})
export class TasksTabComponent {
  @Input() tasks: Task[] = [];
  @Input() filteredTasks!: Signal<Task[]>;
  @Input() categories: TaskCategory[] = [];
  @Input() selectedCategory = '';
  @Input() dashboardCards!: Signal<DashboardCardConfig[]>;
  @Input() dashboardFilter!: DashboardCardFilter;
  @Input() loading = false;
  @Input() error: string | null = null;

  @Output() setCategory = new EventEmitter<string>();
  @Output() setDashboardFilter = new EventEmitter<DashboardCardFilter>();
  @Output() toggleComplete = new EventEmitter<{task: Task, completed: boolean}>();
  @Output() addTaskEvent = new EventEmitter<Partial<Task>>();
  @Output() editTaskEvent = new EventEmitter<{id: string, changes: Partial<Task>}>();
  @Output() deleteTaskEvent = new EventEmitter<string>();

  private readonly dialog = inject(MatDialog);

  public selectedTab: string = 'tasks';

  public isOverdue(dueDate: string | Date): boolean {
    if (!dueDate) return false;
    const date = new Date(dueDate);
    const now = new Date();
    return date < now;
  }

  public openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(AddTaskDialogWrapperComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: Partial<Task> | null) => {
      if (result && result.title) {
        this.addTaskEvent.emit(result);
      }
    });
  }

  public openEditTaskDialog(task: Task): void {
    const dialogRef = this.dialog.open(AddTaskDialogWrapperComponent, {
      width: '400px',
      data: { task }
    });

    dialogRef.afterClosed().subscribe((result: Partial<Task> | null) => {
      if (result && result.title) {
        this.editTaskEvent.emit({ id: task.id, changes: result });
      }
    });
  }

  public deleteTask(id: string): void {
    this.deleteTaskEvent.emit(id);
  }

  public onToggleTaskComplete(task: Task, completed: boolean): void {
    this.toggleComplete.emit({ task, completed });
  }

  public onCategoryChange(categoryId: string): void {
    this.setCategory.emit(categoryId);
  }

  public onDashboardFilterChange(filter: DashboardCardFilter): void {
    this.setDashboardFilter.emit(filter);
  }

  public setTab(tabId: string): void {
    this.selectedTab = tabId;
  }
}
