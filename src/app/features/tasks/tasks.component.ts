import { Component, ChangeDetectionStrategy, OnInit, signal, inject } from '@angular/core';
import { TabOption, TabSwitcherComponent } from '../../shared/components/tab-switcher/tab-switcher.component';
import { TasksTabComponent } from './tasks-tab/tasks-tab.component';
import { CategoriesTabComponent } from './categories-tab/categories-tab.component';
import { TaskFacadeService } from './services/task-facade.service';
import {CommonModule} from '@angular/common';

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

  public selectedTab = signal<string>('tasks');

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
}
