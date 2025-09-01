import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
import { Task } from '../../../core/interfaces/task.model';
import { TaskCategory } from '../../../core/interfaces/item-category.model';
import { DashboardCardConfig } from '../../../shared/components/dashboard-summary-cards/dashboard-summary-cards.component';
import { DashboardCardFilter } from '../../../shared/models/dashboard-card-filter.model';
import {CommonModule} from '@angular/common';
import {LoadingSpinnerComponent} from '../../../shared/components/loading-spinner/loading-spinner.component';
import {ItemCardComponent} from '../../../shared/components/item-card/item-card.component';
import { MatIconModule } from '@angular/material/icon';
import { DashboardSummaryCardsComponent } from '../../../shared/components/dashboard-summary-cards/dashboard-summary-cards.component';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '../../../core/services/task.service';
import { AddTaskDialogWrapperComponent } from '../add-task-dialog-wrapper.component';

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
  @Output() toggleComplete = new EventEmitter<{task: Task, completed: boolean}>();
  @Output() addTaskEvent = new EventEmitter<Partial<Task>>();
  @Output() editTaskEvent = new EventEmitter<{id: string, changes: Partial<Task>}>();
  @Output() deleteTaskEvent = new EventEmitter<string>();

  private dialog = inject(MatDialog);
  private taskService = inject(TaskService);

  // Helper to update local lists
  private addTaskLocally(task: Task): void {
    this.tasks = [task, ...this.tasks];
    this.filteredTasks = [task, ...this.filteredTasks];
  }

  private removeTaskLocally(id: string): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.filteredTasks = this.filteredTasks.filter(t => t.id !== id);
  }

  private updateTaskLocally(id: string, changes: Partial<Task>): void {
    this.tasks = this.tasks.map(t => t.id === id ? { ...t, ...changes } : t);
    this.filteredTasks = this.filteredTasks.map(t => t.id === id ? { ...t, ...changes } : t);
  }

  isOverdue(dueDate: string | Date): boolean {
    const date = new Date(dueDate);
    const now = new Date();
    return date < now;
  }

  openAddTaskDialog(): void {
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

  openEditTaskDialog(task: Task): void {
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

  deleteTask(id: string): void {
    this.deleteTaskEvent.emit(id);
  }

  reloadTasks(): void {
    // This should trigger a reload, e.g. via an output or service event
    // For now, you may need to emit an event or use a shared service
  }
}
