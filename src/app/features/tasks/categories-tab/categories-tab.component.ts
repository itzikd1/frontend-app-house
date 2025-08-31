import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { TaskCategory } from '../../../core/interfaces/item-category.model';
import {CommonModule} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-categories-tab',
  templateUrl: './categories-tab.component.html',
  styleUrls: ['./categories-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatIconModule, LoadingSpinnerComponent]
})
export class CategoriesTabComponent {
  @Input() categories: TaskCategory[] = [];
  @Input() categoryLoading = false;
  @Input() categoryError: string | null = null;

  @Output() openEditCategoryDialog = new EventEmitter<TaskCategory>();
}
