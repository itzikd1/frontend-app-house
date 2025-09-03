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
  private readonly dialog = inject(MatDialog);
  private readonly taskService = inject(TaskFacadeService);

  // Expose facade signals
  public readonly tasks = this.taskService.tasks;
  public readonly filteredTasks = this.taskService.filteredTasks;
  public readonly taskLoading = this.taskService.taskLoading;
  public readonly taskError = this.taskService.taskError;
  public readonly categories = this.taskService.categories;
  public readonly selectedCategory = this.taskService.selectedCategory;
  public readonly categoryLoading = this.taskService.categoryLoading;
  public readonly categoryError = this.taskService.categoryError;
  public readonly dashboardCards = this.taskService.dashboardCards;
  public readonly dashboardFilter = this.taskService.dashboardFilter;

  public selectedTab = signal<string>('tasks');

  public readonly tabOptions: TabOption[] = [
    { id: 'tasks', label: 'Tasks' },
    { id: 'categories', label: 'Categories' },
  ];

  ngOnInit(): void {
    this.taskService.loadTasks();
    this.taskService.loadCategories();
  }

  public setTab(tab: string): void {
    this.selectedTab.set(tab);
  }

  public setDashboardFilter(filter: DashboardCardFilter): void {
    this.taskService.setDashboardFilter(filter);
  }

  public setCategory(categoryId: string): void {
    this.taskService.setCategory(categoryId);
  }

  public onToggleTaskComplete(task: Task, completed: boolean): void {
    this.taskService.updateTask(task.id, { completed }).catch(() => {
      // Error handling is done in the facade
    });
  }

  public onAddTask(task: Partial<Task>): void {
    this.taskService.addTask(task).catch(() => {
      // Error handling is done in the facade
    });
  }

  public onEditTask({ id, changes }: { id: string; changes: Partial<Task> }): void {
    this.taskService.updateTask(id, changes).catch(() => {
      // Error handling is done in the facade
    });
  }

  public onDeleteTask(id: string): void {
    this.taskService.deleteTask(id).catch(() => {
      // Error handling is done in the facade
    });
  }

  // Category management methods
  public onAddCategory(): void {
    const dialogRef = this.dialog.open(AddCategoryDialogWrapperComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(async (result: { name: string } | null) => {
      if (result && result.name) {
        await this.taskService.createCategory({ name: result.name });
        // Loading/error state handled in facade
      }
    });
  }

  public onEditCategory(event: { id: string, name: string }): void {
    const dialogRef = this.dialog.open(AddCategoryDialogWrapperComponent, {
      width: '400px',
      data: { category: { id: event.id, name: event.name } }
    });

    dialogRef.afterClosed().subscribe(async (result: { name: string; id?: string } | null) => {
      if (result && result.name && result.id) {
        await this.taskService.updateCategory(result.id, { name: result.name });
        // Loading/error state handled in facade
      }
    });
  }

  public onDeleteCategory(categoryId: string): void {
    this.taskService.deleteCategory(categoryId);
    // Loading/error state handled in facade
  }

}
