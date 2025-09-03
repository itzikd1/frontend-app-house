import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import { TaskCategory } from '../../../core/interfaces/item-category.model';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-task-category-filter',
  templateUrl: './task-category-filter.component.html',
  styleUrls: ['./task-category-filter.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCategoryFilterComponent {
  @Input() categories: TaskCategory[] = [];
  @Input() selectedCategory: string = 'all';
  @Input() tasksCount: number = 0;
  @Output() categoryChange = new EventEmitter<string>();

  onCategorySelect(categoryId: string): void {
    this.categoryChange.emit(categoryId);
  }
}

