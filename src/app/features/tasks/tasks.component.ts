import { Component, ChangeDetectionStrategy, OnInit, signal, inject } from '@angular/core';
import { Task } from '../../core/interfaces/task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DashboardCardFilter } from '../../shared/models/dashboard-card-filter.model';
import { TabOption, TabSwitcherComponent } from '../../shared/components/tab-switcher/tab-switcher.component';
import { TasksTabComponent } from './tasks-tab/tasks-tab.component';
import { CategoriesTabComponent } from './categories-tab/categories-tab.component';
import { TaskFacadeService } from './services/task-facade.service';
import { AddCategoryDialogWrapperComponent } from './dialogs/add-category-dialog-wrapper.component';
import { TaskCategoryService } from '../../core/services/item-category.service';

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
  private readonly taskFacade = inject(TaskFacadeService);
  private readonly dialog = inject(MatDialog);
  private readonly categoryService = inject(TaskCategoryService);

  // Expose facade signals
  public readonly tasks = this.taskFacade.tasks;
  public readonly categories = this.taskFacade.categories;
  public readonly filteredTasks = this.taskFacade.filteredTasks;
  public readonly dashboardCards = this.taskFacade.dashboardCards;
  public readonly loading = this.taskFacade.loading;
  public readonly error = this.taskFacade.error;
  public readonly selectedCategory = this.taskFacade.selectedCategory;
  public readonly dashboardFilter = this.taskFacade.dashboardFilter;

  public selectedTab = signal<string>('tasks');
  public categoryLoading = signal<boolean>(false);
  public categoryError = signal<string | null>(null);

  public readonly tabOptions: TabOption[] = [
    { id: 'tasks', label: 'Tasks' },
    { id: 'categories', label: 'Categories' },
  ];

  ngOnInit(): void {
    this.taskFacade.loadTasks();
    this.taskFacade.loadCategories();
  }

  public setTab(tab: string): void {
    this.selectedTab.set(tab);
  }

  public setCategory(categoryId: string): void {
    this.taskFacade.setCategory(categoryId);
  }

  public setDashboardFilter(filter: DashboardCardFilter): void {
    this.taskFacade.setDashboardFilter(filter);
  }

  public onToggleComplete(task: Task, completed: boolean): void {
    this.taskFacade.updateTask(task.id, { completed }).catch(() => {
      // Error handling is done in the facade
    });
  }

  public onDeleteTask(id: string): void {
    this.taskFacade.deleteTask(id).catch(() => {
      // Error handling is done in the facade
    });
  }

  public onAddTask(task: Partial<Task>): void {
    this.taskFacade.addTask(task).catch(() => {
      // Error handling is done in the facade
    });
  }

  public onEditTask({ id, changes }: { id: string; changes: Partial<Task> }): void {
    this.taskFacade.updateTask(id, changes).catch(() => {
      // Error handling is done in the facade
    });
  }

  public onDeleteTaskFromTab(id: string): void {
    this.taskFacade.deleteTask(id).catch(() => {
      // Error handling is done in the facade
    });
  }

  // Category management methods
  public onAddCategory(): void {
    const dialogRef = this.dialog.open(AddCategoryDialogWrapperComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: { name: string } | null) => {
      if (result && result.name) {
        this.categoryLoading.set(true);
        this.categoryService.create({ name: result.name }).subscribe({
          next: () => {
            this.taskFacade.loadCategories();
            this.categoryLoading.set(false);
          },
          error: () => {
            this.categoryError.set('Failed to create category');
            this.categoryLoading.set(false);
          }
        });
      }
    });
  }

  public onEditCategory(event: { id: string, name: string }): void {
    const dialogRef = this.dialog.open(AddCategoryDialogWrapperComponent, {
      width: '400px',
      data: { category: { id: event.id, name: event.name } }
    });

    dialogRef.afterClosed().subscribe((result: { name: string; id?: string } | null) => {
      if (result && result.name && result.id) {
        this.categoryLoading.set(true);
        this.categoryService.update(result.id, { name: result.name }).subscribe({
          next: () => {
            this.taskFacade.loadCategories();
            this.categoryLoading.set(false);
          },
          error: () => {
            this.categoryError.set('Failed to update category');
            this.categoryLoading.set(false);
          }
        });
      }
    });
  }

  public onDeleteCategory(categoryId: string): void {
    this.categoryLoading.set(true);
    this.categoryService.delete(categoryId).subscribe({
      next: () => {
        this.taskFacade.loadCategories();
        this.categoryLoading.set(false);
      },
      error: () => {
        this.categoryError.set('Failed to delete category');
        this.categoryLoading.set(false);
      }
    });
  }

  public loadCategories(): void {
    this.taskFacade.loadCategories();
  }
}
