import { Component, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../shared/models/task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AddTaskDialogWrapperComponent } from './add-task-dialog-wrapper.component';
import { ItemCardComponent } from '../../shared/components/item-card/item-card.component';
import { DashboardCardConfig } from '../../shared/components/dashboard-summary-cards/dashboard-summary-cards.component';
import { DashboardSummaryCardsComponent } from '../../shared/components/dashboard-summary-cards/dashboard-summary-cards.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerComponent,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    ItemCardComponent,
    DashboardSummaryCardsComponent
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent implements OnInit {
  tasks = signal<Task[]>([]);
  error = signal<string | null>(null);
  loading = signal<boolean>(true);

  // Edit task state
  editing = signal<boolean>(false);
  editTask = signal<Task | null>(null);
  editTaskForm: Partial<Task> | null = null;

  private adding = signal<boolean>(false);

  public selectedStatus: 'all' = 'all';
  public selectedCategory: string = 'all';

  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.loading.set(true);
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load tasks.');
        this.loading.set(false);
      }
    });
  }

  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(AddTaskDialogWrapperComponent, {
      width: '400px',
      data: {}
    });
    dialogRef.afterClosed().subscribe((result: Partial<Task> | null) => {
      if (result && result.title) {
        this.addTask(result);
      }
    });
  }

  addTask(task: Partial<Task>): void {
    if (this.adding()) return;
    if (!task.title) return;
    this.adding.set(true);
    this.taskService.createTask(task).subscribe({
      next: (newTask: Task) => {
        this.tasks.set([newTask, ...this.tasks()]);
        this.adding.set(false);
      },
      error: () => {
        this.error.set('Failed to add task.');
        this.adding.set(false);
      }
    });
  }

  startEdit(task: Task): void {
    this.editing.set(true);
    this.editTask.set({ ...task });
    this.editTaskForm = { ...task };
  }

  deleteTask(id: string): void {
    this.loading.set(true);
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks.set(this.tasks().filter(t => t.id !== id));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to delete task.');
        this.loading.set(false);
      }
    });
  }

  get overdueCount(): number {
    return this.tasks().filter(t => this.isOverdue(t)).length;
  }

  get dashboardCards(): DashboardCardConfig[] {
    return [
      {
        title: 'Total Tasks',
        value: this.tasks().length,
        icon: 'list',
        color: '#9ca3af',
      },
      {
        title: 'Overdue',
        value: this.overdueCount,
        icon: 'error',
        color: '#ef4444',
      },
    ];
  }

  public get filteredTasks(): Task[] {
    let filtered = this.tasks();
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === this.selectedCategory);
    }
    return filtered;
  }

  public setStatus(status: 'all'): void {
    this.selectedStatus = status;
  }

  public setCategory(category: string): void {
    this.selectedCategory = category;
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    const now = new Date();
    return due < now;
  }
}
