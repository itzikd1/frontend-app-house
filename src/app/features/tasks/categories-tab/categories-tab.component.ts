import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { TaskCategory } from '../../../core/interfaces/item-category.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ItemCardComponent } from '../../../shared/components/item-card/item-card.component';
import { Item } from '../../../shared/models/item.model';

@Component({
  selector: 'app-categories-tab',
  templateUrl: './categories-tab.component.html',
  styleUrls: ['./categories-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatIconModule, LoadingSpinnerComponent, ItemCardComponent]
})
export class CategoriesTabComponent {
  @Input() categories: TaskCategory[] = [];
  @Input() categoryLoading = false;
  @Input() categoryError: string | null = null;

  @Output() addCategory = new EventEmitter<{name: string}>();
  @Output() editCategory = new EventEmitter<{id: string, name: string}>();
  @Output() deleteCategory = new EventEmitter<string>();

  public get categoryItems(): Item[] {
    return this.categories.map(category => ({
      title: category.name,
      description: `Category ID: ${category.id}`,
      id: category.id,
    }));
  }

  public onAddCategory(): void {
    // This will be handled by parent component with proper dialog management
    this.addCategory.emit({ name: '' });
  }

  public onEditCategory(category: TaskCategory): void {
    this.editCategory.emit({ id: category.id, name: category.name });
  }

  public onDeleteCategory(id: string): void {
    this.deleteCategory.emit(id);
  }
}
