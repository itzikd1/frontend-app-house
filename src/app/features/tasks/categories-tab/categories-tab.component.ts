import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { TaskCategory } from '../../../core/interfaces/item-category.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ItemCardComponent } from '../../../shared/components/item-card/item-card.component';
import { Item } from '../../../shared/models/item.model';
import { MatDialog } from '@angular/material/dialog';
import { TaskCategoryService } from '../../../core/services/item-category.service';
import { AddCategoryDialogWrapperComponent } from '../add-category-dialog-wrapper.component';

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

  private dialog = inject(MatDialog);
  private categoryService = inject(TaskCategoryService);

  get categoryItems(): Item[] {
    return this.categories.map(category => ({
      title: category.name,
      description: '',
    }));
  }

  openAddCategoryDialog(): void {
    const dialogRef = this.dialog.open(AddCategoryDialogWrapperComponent, {
      width: '400px',
      data: {}
    });
    dialogRef.afterClosed().subscribe((result: { name: string } | null) => {
      if (result && result.name) {
        this.categoryService.create({ name: result.name }).subscribe(() => {
          this.reloadCategories();
        });
      }
    });
  }

  openEditCategoryDialog(category: TaskCategory): void {
    const dialogRef = this.dialog.open(AddCategoryDialogWrapperComponent, {
      width: '400px',
      data: { category }
    });
    dialogRef.afterClosed().subscribe((result: { name: string; id?: string } | null) => {
      if (result && result.name && result.id) {
        this.categoryService.update(result.id, { name: result.name }).subscribe(() => {
          this.reloadCategories();
        });
      }
    });
  }

  deleteCategory(id: string): void {
    this.categoryService.delete(id).subscribe(() => {
      this.reloadCategories();
    });
  }

  reloadCategories(): void {
    // This should trigger a reload, e.g. via an output or service event
    // For now, you may need to emit an event or use a shared service
  }
}
