import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { TaskCategory } from '../../../core/interfaces/item-category.model';
import { CommonModule } from '@angular/common';

const ALL_CATEGORIES_ID = 'all' as const;

@Component({
  selector: 'app-task-category-filter',
  templateUrl: './task-category-filter.component.html',
  styleUrls: ['./task-category-filter.component.scss'],
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCategoryFilterComponent {
  @Input() public categories: TaskCategory[] = [];
  @Input() public selectedCategory: string = ALL_CATEGORIES_ID;
  @Input() public tasksCount: number = 0;
  @Output() public categoryChange = new EventEmitter<string>();

  public readonly ALL_CATEGORIES_ID = ALL_CATEGORIES_ID;

  public onCategorySelect(categoryId: string): void {
    this.categoryChange.emit(categoryId);
  }
}
