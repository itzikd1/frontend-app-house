import { Component, ChangeDetectionStrategy, OnInit, signal, inject } from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../core/interfaces/task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AddTaskDialogWrapperComponent } from './add-task-dialog-wrapper.component';
import { FabButtonComponent } from '../../shared/components/fab-button/fab-button.component';
import { TaskCategoryService } from '../../core/services/item-category.service';
import { AddCategoryDialogWrapperComponent } from './add-category-dialog-wrapper.component';
import { TaskCategory } from '../../core/interfaces/item-category.model';
import { DashboardCardFilter } from '../../shared/models/dashboard-card-filter.model';
import { TabOption, TabSwitcherComponent } from '../../shared/components/tab-switcher/tab-switcher.component';
import { TasksTabComponent } from './tasks-tab/tasks-tab.component';
import { CategoriesTabComponent } from './categories-tab/categories-tab.component';
import { DashboardCardConfig } from '../../shared/components/dashboard-summary-cards/dashboard-summary-cards.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    FabButtonComponent,
    TabSwitcherComponent,
    TasksTabComponent,
    CategoriesTabComponent,
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

  public selectedCategory = signal<string>('all');

  // Tab logic
  selectedTab = signal<string>('tasks');

  // Category management state
  categories = signal<TaskCategory[]>([]);
  categoryLoading = signal<boolean>(false);
  categoryError = signal<string | null>(null);

  // New dashboard filter state
  public dashboardFilter = signal<DashboardCardFilter>(DashboardCardFilter.All);

  public tabOptions: TabOption[] = [
    { id: 'tasks', label: 'Tasks' },
    { id: 'categories', label: 'Categories' },
  ];

  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);
  private categoryService = inject(TaskCategoryService);

  ngOnInit(): void {
    this.fetchTasks();
    this.loadCategories();
  }

  private sortTasks(tasks: Task[]): Task[] {
    return tasks.slice().sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });
  }

  fetchTasks(): void {
    this.loading.set(true);
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(this.sortTasks(tasks));
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
    const payload: Partial<Task> = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      repeat: task.repeat,
      categoryId: task.categoryId,
      completed: false,
    };
    this.taskService.createTask(payload).subscribe({
      next: () => {
        this.fetchTasks(); // Always reload tasks from backend after add
        this.selectedCategory.set('all');
        this.adding.set(false);
      },
      error: () => {
        this.error.set('Failed to add task.');
        this.adding.set(false);
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
        this.updateTask(task.id, result);
      }
    });
  }

  updateTask(id: string, changes: Partial<Task>): void {
    this.loading.set(true);
    const originalTask = this.tasks().find(t => t.id === id);
    const repeatFrequency = (changes as { repeatFrequency?: string }).repeatFrequency ?? (originalTask as { repeatFrequency?: string })?.repeatFrequency ?? '';
    // Always include categoryId as a string
    const categoryId = (typeof changes.categoryId === 'string' && changes.categoryId)
      ? changes.categoryId
      : originalTask?.categoryId ?? '';
    const payload = { ...changes, repeatFrequency, categoryId };
    this.taskService.updateTask(id, payload).subscribe({
      next: (updatedTask: Task) => {
        if (updatedTask && updatedTask.id) {
          this.tasks.set(
            this.tasks().map(t => t.id === id ? updatedTask : t)
          );
        }
        this.loading.set(false);
        this.editing.set(false);
        this.editTask.set(null);
        this.editTaskForm = null;
      },
      error: () => {
        this.error.set('Failed to update task.');
        this.loading.set(false);
      }
    });
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

  // Tab switching
  setTab(tab: string): void {
    this.selectedTab.set(tab);
  }

  // Category management
  loadCategories(): void {
    this.categoryLoading.set(true);
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.categoryLoading.set(false);
      },
      error: () => {
        this.categoryError.set('Failed to load categories.');
        this.categoryLoading.set(false);
      }
    });
  }

  openEditCategoryDialog(category: TaskCategory): void {
    const dialogRef = this.dialog.open(AddCategoryDialogWrapperComponent, {
      width: '400px',
      data: { category }
    });
    dialogRef.afterClosed().subscribe((result: { name: string; id?: string; isEdit: boolean } | null) => {
      if (result && result.name && result.id) {
        this.categoryLoading.set(true);
        this.categoryService.update(result.id, { name: result.name }).subscribe({
          next: () => {
            this.loadCategories();
            this.categoryLoading.set(false);
          },
          error: () => {
            this.categoryError.set('Failed to update category.');
            this.categoryLoading.set(false);
          }
        });
      }
    });
  }

  deleteCategory(category: TaskCategory): void {
    this.categoryService.delete(category.id).subscribe(() => {
      this.loadCategories();
    });
  }

  onDeleteCategory(id: string): void {
    this.categoryLoading.set(true);
    this.categoryService.delete(id).subscribe({
      next: () => {
        const updated = this.categories().filter(cat => cat.id !== id);
        this.categories.set(updated);
        this.categoryLoading.set(false);
        this.categoryError.set(null);
      },
      error: () => {
        this.categoryError.set('Failed to delete category.');
        this.categoryLoading.set(false);
      }
    });
  }

  get overdueCount(): number {
    return this.tasks().filter(t => this.isOverdue(t)).length;
  }

  get completeCount(): number {
    return this.tasks().filter(t => t.completed).length;
  }

  get incompleteCount(): number {
    return this.tasks().filter(t => !t.completed).length;
  }

  get dashboardCards(): DashboardCardConfig[] {
    return [
      {
        title: 'Total Tasks',
        value: this.tasks().length,
        icon: 'list',
        color: '#9ca3af',
        filter: DashboardCardFilter.All,
      },
      {
        title: 'Overdue',
        value: this.overdueCount,
        icon: 'error',
        color: '#ef4444',
        filter: DashboardCardFilter.Overdue,
      },
      {
        title: 'Complete',
        value: this.completeCount,
        icon: 'check_circle',
        color: '#22c55e',
        filter: DashboardCardFilter.Complete,
      },
      {
        title: 'Incomplete',
        value: this.incompleteCount,
        icon: 'radio_button_unchecked',
        color: '#fbbf24',
        filter: DashboardCardFilter.Incomplete,
      },
    ];
  }

  public setDashboardFilter(filter: DashboardCardFilter): void {
    this.dashboardFilter.set(filter);
  }

  public get filteredTasks(): Task[] {
    let filtered = this.tasks();
    // Category filter
    if (this.selectedCategory() !== 'all') {
      filtered = filtered.filter(t => t.categoryId === this.selectedCategory());
    }
    // Dashboard filter
    switch (this.dashboardFilter()) {
      case DashboardCardFilter.Overdue:
        filtered = filtered.filter(t => this.isOverdue(t));
        break;
      case DashboardCardFilter.Complete:
        filtered = filtered.filter(t => t.completed);
        break;
      case DashboardCardFilter.Incomplete:
        filtered = filtered.filter(t => !t.completed);
        break;
      case DashboardCardFilter.All:
      default:
        // No additional filter
        break;
    }
    return filtered;
  }

  public setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  public getCategoryName(categoryId: string): string {
    const category = this.categories().find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    const now = new Date();
    return due < now;
  }

  openAddCategoryDialog(): void {
    const dialogRef = this.dialog.open(AddCategoryDialogWrapperComponent, {
      width: '400px',
      data: {}
    });
    dialogRef.afterClosed().subscribe((result: string | { name: string }) => {
      if (result) {
        this.categoryLoading.set(true);
        const name = typeof result === 'string' ? result : result.name;
        this.categoryService.create({ name }).subscribe({
          next: () => {
            this.loadCategories();
            this.categoryLoading.set(false);
          },
          error: () => {
            this.categoryError.set('Failed to add category.');
            this.categoryLoading.set(false);
          }
        });
      }
    });
  }

  onToggleComplete(task: Task, completed: boolean): void {
    // Optimistically update UI with a new object reference
    this.tasks.set(
      this.tasks().map(t => t.id === task.id ? { ...t, completed } : t)
    );
    this.taskService.updateTask(task.id, { completed }).subscribe({
      next: (updatedTask: Task) => {
        if (updatedTask && updatedTask.id) {
          this.tasks.set(
            this.tasks().map(t => t.id === task.id ? updatedTask : t)
          );
        }
      },
      error: () => {
        this.error.set('Failed to update task completion.');
        // Revert UI if error
        this.tasks.set(
          this.tasks().map(t => t.id === task.id ? { ...t, completed: task.completed } : t)
        );
      }
    });
  }
}
