import { Component, ChangeDetectionStrategy, OnInit, signal, inject } from '@angular/core';
import { TabOption, TabSwitcherComponent } from '../../shared/components/tab-switcher/tab-switcher.component';
import { TasksTabComponent } from './tasks-tab/tasks-tab.component';
import { CategoriesTabComponent } from './categories-tab/categories-tab.component';
import { TaskFacadeService } from './services/task-facade.service';
import { CommonModule } from '@angular/common';

// Constants for better maintainability
const TASK_TAB_ID = 'tasks' as const;
const CATEGORIES_TAB_ID = 'categories' as const;

type TaskTabId = typeof TASK_TAB_ID | typeof CATEGORIES_TAB_ID;

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
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

  public readonly selectedTab = signal<TaskTabId>(TASK_TAB_ID);

  public readonly tabOptions: TabOption[] = [
    { id: TASK_TAB_ID, label: 'Tasks' },
    { id: CATEGORIES_TAB_ID, label: 'Categories' },
  ] as const;

  public ngOnInit(): void {
    this.taskFacade.loadTasks();
    this.taskFacade.loadCategories();
  }

  public setTab(tab: string): void {
    if (this.isValidTab(tab)) {
      this.selectedTab.set(tab);
    }
  }

  private isValidTab(tab: string): tab is TaskTabId {
    return tab === TASK_TAB_ID || tab === CATEGORIES_TAB_ID;
  }
}
