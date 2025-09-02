import { Injectable, inject, signal, computed } from '@angular/core';
import { TaskService } from '../../../core/services/task.service';
import { TaskCategoryService } from '../../../core/services/item-category.service';
import { Task } from '../../../core/interfaces/task.model';
import { TaskCategory } from '../../../core/interfaces/item-category.model';
import { DashboardCardFilter } from '../../../shared/models/dashboard-card-filter.model';
import { DashboardCardConfig } from '../../../shared/components/dashboard-summary-cards/dashboard-summary-cards.component';
import { TaskUtils } from '../utils/task.utils';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskFacadeService {
  private readonly taskService = inject(TaskService);
  private readonly categoryService = inject(TaskCategoryService);

  // State signals
  private readonly _tasks = signal<Task[]>([]);
  private readonly _categories = signal<TaskCategory[]>([]);
  private readonly _selectedCategory = signal<string>('all');
  private readonly _dashboardFilter = signal<DashboardCardFilter>(DashboardCardFilter.All);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  public readonly _categoryLoading = signal<boolean>(false);
  public readonly _categoryError = signal<string | null>(null);

  // Public readonly signals
  public readonly tasks = this._tasks.asReadonly();
  public readonly categories = this._categories.asReadonly();
  public readonly selectedCategory = this._selectedCategory.asReadonly();
  public readonly dashboardFilter = this._dashboardFilter.asReadonly();
  public readonly taskLoading = this._loading.asReadonly();
  public readonly taskError = this._error.asReadonly();
  public readonly categoryLoading = this._categoryLoading.asReadonly()
  public readonly categoryError = this._categoryError.asReadonly();

  // Computed signals
  public readonly filteredTasks = computed(() => {
    const allTasks = this._tasks();
    const categoryFilter = this._selectedCategory();
    const dashFilter = this._dashboardFilter();

    let filtered = TaskUtils.filterByCategory(allTasks, categoryFilter);

    switch (dashFilter) {
      case DashboardCardFilter.Overdue:
        filtered = filtered.filter(t => TaskUtils.isOverdue(t));
        break;
      case DashboardCardFilter.Complete:
        filtered = TaskUtils.filterByCompletion(filtered, true);
        break;
      case DashboardCardFilter.Incomplete:
        filtered = TaskUtils.filterByCompletion(filtered, false);
        break;
      case DashboardCardFilter.All:
      default:
        break;
    }

    return TaskUtils.sortTasks(filtered);
  });

  public readonly dashboardCards = computed((): DashboardCardConfig[] => {
    const tasks = this._tasks();
    return [
      {
        title: 'Total Tasks',
        value: tasks.length,
        icon: 'list',
        color: '#9ca3af',
        filter: DashboardCardFilter.All,
      },
      {
        title: 'Overdue',
        value: tasks.filter(t => TaskUtils.isOverdue(t)).length,
        icon: 'error',
        color: '#ef4444',
        filter: DashboardCardFilter.Overdue,
      },
      {
        title: 'Complete',
        value: TaskUtils.filterByCompletion(tasks, true).length,
        icon: 'check_circle',
        color: '#22c55e',
        filter: DashboardCardFilter.Complete,
      },
      {
        title: 'Incomplete',
        value: TaskUtils.filterByCompletion(tasks, false).length,
        icon: 'radio_button_unchecked',
        color: '#fbbf24',
        filter: DashboardCardFilter.Incomplete,
      },
    ];
  });

  public loadTasks(): void {
    this._loading.set(true);
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this._tasks.set(TaskUtils.sortTasks(tasks));
        this._loading.set(false);
        this._error.set(null);
      },
      error: (error) => {
        this._error.set('Failed to load tasks.');
        this._loading.set(false);
        console.error('Error loading tasks:', error);
      }
    });
  }

  public loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this._categories.set(categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  public setCategory(categoryId: string): void {
    this._selectedCategory.set(categoryId);
  }

  public setDashboardFilter(filter: DashboardCardFilter): void {
    this._dashboardFilter.set(filter);
  }

  public async addTask(taskData: Partial<Task>): Promise<void> {
    const tempId = TaskUtils.generateTempId();
    const optimisticTask: Task = { ...taskData, id: tempId, completed: false } as Task;

    // Optimistic update
    this._tasks.update(tasks => TaskUtils.sortTasks([optimisticTask, ...tasks]));

    try {
      const createdTask = await firstValueFrom(this.taskService.createTask(taskData));
      if (createdTask) {
        // Replace temp task with real one
        this._tasks.update(tasks =>
          TaskUtils.sortTasks(tasks.map(t => t.id === tempId ? createdTask : t))
        );
      }
    } catch (error) {
      // Revert on error
      this._tasks.update(tasks => tasks.filter(t => t.id !== tempId));
      this._error.set('Failed to add task.');
      throw error;
    }
  }

  public async updateTask(id: string, changes: Partial<Task>): Promise<void> {
    const previousTasks = this._tasks();

    // Optimistic update
    this._tasks.update(tasks =>
      TaskUtils.sortTasks(tasks.map(t => t.id === id ? { ...t, ...changes } : t))
    );

    try {
      await firstValueFrom(this.taskService.updateTask(id, changes));
    } catch (error) {
      // Revert on error
      this._tasks.set(previousTasks);
      this._error.set('Failed to update task.');
      throw error;
    }
  }

  public async deleteTask(id: string): Promise<void> {
    const previousTasks = this._tasks();

    // Optimistic update
    this._tasks.update(tasks => tasks.filter(task => task.id !== id));

    try {
      await firstValueFrom(this.taskService.deleteTask(id));
    } catch (error) {
      // Revert on error
      this._tasks.set(previousTasks);
      this._error.set('Failed to delete task.');
      throw error;
    }
  }
}
