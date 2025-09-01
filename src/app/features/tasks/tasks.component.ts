import { Component, ChangeDetectionStrategy, OnInit, signal, inject } from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../core/interfaces/task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TaskCategoryService } from '../../core/services/item-category.service';
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

  public selectedCategory = signal<string>('all');
  selectedTab = signal<string>('tasks');
  categories = signal<TaskCategory[]>([]);
  categoryLoading = signal<boolean>(false);
  categoryError = signal<string | null>(null);
  public dashboardFilter = signal<DashboardCardFilter>(DashboardCardFilter.All);
  public tabOptions: TabOption[] = [
    { id: 'tasks', label: 'Tasks' },
    { id: 'categories', label: 'Categories' },
  ];
  private taskService = inject(TaskService);
  private categoryService = inject(TaskCategoryService);

  filteredTasks: Task[] = [];
  dashboardCards: DashboardCardConfig[] = [];

  ngOnInit(): void {
    this.fetchTasks();
    this.loadCategories();
    this.updateFilteredTasks();
    this.initDashboardCards();
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
        this.updateFilteredTasks();
      },
      error: () => {
        this.error.set('Failed to load tasks.');
        this.loading.set(false);
      }
    });
  }

  setTab(tab: string): void {
    this.selectedTab.set(tab);
  }

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

  setCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    this.updateFilteredTasks();
  }

  updateFilteredTasks(): void {
    const allTasks = this.tasks();
    const selected = this.selectedCategory();
    this.filteredTasks = selected === 'all'
      ? allTasks
      : allTasks.filter(task => task.categoryId === selected);
  }

  initDashboardCards(): void {
    // Example: initialize with empty array or with summary cards if you have logic
    this.dashboardCards = [];
    // If you have logic to populate dashboardCards, add it here
  }

  setDashboardFilter(filter: DashboardCardFilter): void {
    this.dashboardFilter.set(filter);
  }

  onToggleComplete(task: Task, completed: boolean): void {
    // Optimistically update UI
    const updatedTasks = this.tasks().map(t =>
      t.id === task.id ? { ...t, completed } : t
    );
    this.tasks.set(updatedTasks);
    this.updateFilteredTasks();
    // Sync with backend
    this.taskService.updateTask(task.id, { completed }).subscribe({
      error: () => {
        // Revert if failed
        this.tasks.set(this.tasks().map(t =>
          t.id === task.id ? { ...t, completed: !completed } : t
        ));
        this.updateFilteredTasks();
        this.error.set('Failed to update task.');
      }
    });
  }

  onDeleteTask(id: string): void {
    // Optimistically update UI
    const prevTasks = this.tasks();
    const updatedTasks = prevTasks.filter(task => task.id !== id);
    this.tasks.set(updatedTasks);
    this.updateFilteredTasks();
    // Sync with backend
    this.taskService.deleteTask(id).subscribe({
      error: () => {
        // Revert if failed
        this.tasks.set(prevTasks);
        this.updateFilteredTasks();
        this.error.set('Failed to delete task.');
      }
    });
  }

  // Handle add task event from tab
  onAddTask(task: Partial<Task>): void {
    const tempId = 'temp-' + Date.now();
    const optimisticTask: Task = { ...task, id: tempId, completed: false } as Task;
    const prevTasks = this.tasks();
    this.tasks.set([optimisticTask, ...prevTasks]);
    this.updateFilteredTasks();
    this.taskService.createTask(task).subscribe({
      next: (created: Task) => {
        // Replace temp task with real one
        this.tasks.set([created, ...prevTasks]);
        this.updateFilteredTasks();
      },
      error: () => {
        // Revert if failed
        this.tasks.set(prevTasks);
        this.updateFilteredTasks();
        this.error.set('Failed to add task.');
      }
    });
  }

  // Handle edit task event from tab
  onEditTask({ id, changes }: { id: string; changes: Partial<Task> }): void {
    const prevTasks = this.tasks();
    this.tasks.set(prevTasks.map(t => t.id === id ? { ...t, ...changes } : t));
    this.updateFilteredTasks();
    this.taskService.updateTask(id, changes).subscribe({
      error: () => {
        // Revert if failed
        this.tasks.set(prevTasks);
        this.updateFilteredTasks();
        this.error.set('Failed to update task.');
      }
    });
  }

  // Handle delete task event from tab
  onDeleteTaskFromTab(id: string): void {
    const prevTasks = this.tasks();
    this.tasks.set(prevTasks.filter(task => task.id !== id));
    this.updateFilteredTasks();
    this.taskService.deleteTask(id).subscribe({
      error: () => {
        // Revert if failed
        this.tasks.set(prevTasks);
        this.updateFilteredTasks();
        this.error.set('Failed to delete task.');
      }
    });
  }
}
