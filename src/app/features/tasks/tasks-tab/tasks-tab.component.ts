import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Task } from '../../../core/interfaces/task.model';
import { DashboardCardFilter } from '../../../shared/models/dashboard-card-filter.model';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ItemCardComponent } from '../../../shared/components/item-card/item-card.component';
import { MatIconModule } from '@angular/material/icon';
import { DashboardSummaryCardsComponent } from '../../../shared/components/dashboard-summary-cards/dashboard-summary-cards.component';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogWrapperComponent } from '../dialogs/add-task-dialog-wrapper.component';
import { TaskFacadeService } from '../services/task-facade.service';
import { TaskUtils } from '../utils/task.utils';
import {TaskCategoryFilterComponent} from '../task-category-filter/task-category-filter.component';

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
    TaskCategoryFilterComponent,
  ],
  standalone: true,
})
export class TasksTabComponent {
  private readonly dialog = inject(MatDialog);
  private readonly taskFacade = inject(TaskFacadeService);

  // Expose facade signals directly
  public readonly tasks = this.taskFacade.tasks;
  public readonly filteredTasks = this.taskFacade.filteredTasks;
  public readonly categories = this.taskFacade.categories;
  public readonly selectedCategory = this.taskFacade.selectedCategory;
  public readonly dashboardCards = this.taskFacade.dashboardCards;
  public readonly dashboardFilter = this.taskFacade.dashboardFilter;
  public readonly taskLoading = this.taskFacade.taskLoading;
  public readonly taskError = this.taskFacade.taskError;

  public isOverdue(dueDate: string | Date): boolean {
    return TaskUtils.isOverdue({ dueDate } as Task);
  }

  public setCategory(categoryId: string): void {
    this.taskFacade.setCategory(categoryId);
  }

  public setDashboardFilter(filter: DashboardCardFilter): void {
    this.taskFacade.setDashboardFilter(filter);
  }

  public openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(AddTaskDialogWrapperComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: Partial<Task> | null) => {
      if (result && result.title) {
        this.taskFacade.addTask(result);
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
        this.taskFacade.updateTask(task.id, result);
      }
    });
  }

  public deleteTask(id: string): void {
    this.taskFacade.deleteTask(id);
  }

  public onToggleTaskComplete(task: Task, completed: boolean): void {
    this.taskFacade.updateTask(task.id, { completed });
  }
}
