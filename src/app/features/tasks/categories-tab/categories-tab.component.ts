import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TaskCategory } from '../../../core/interfaces/item-category.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ItemCardComponent } from '../../../shared/components/item-card/item-card.component';
import { Item } from '../../../shared/models/item.model';
import { TaskFacadeService } from '../services/task-facade.service';
import { AddCategoryDialogWrapperComponent } from '../dialogs/add-category-dialog-wrapper.component';

@Component({
  selector: 'app-categories-tab',
  templateUrl: './categories-tab.component.html',
  styleUrls: ['./categories-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatIconModule, LoadingSpinnerComponent, ItemCardComponent]
})
export class CategoriesTabComponent {
  private readonly dialog = inject(MatDialog);
  private readonly taskFacade = inject(TaskFacadeService);

  // Expose facade signals directly
  public readonly categories = this.taskFacade.categories;
  public readonly categoryLoading = this.taskFacade.categoryLoading;
  public readonly categoryError = this.taskFacade.categoryError;

  public get categoryItems(): Item[] {
    return this.categories().map(category => ({
      title: category.name,
      description: `Category ID: ${category.id}`,
      id: category.id,
    }));
  }

  public onAddCategory(): void {
    const dialogRef = this.dialog.open(AddCategoryDialogWrapperComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: {name: string} | null) => {
      if (result && result.name.trim()) {
        this.taskFacade.createCategory({ name: result.name.trim() });
      }
    });
  }

  public onEditCategory(category: TaskCategory): void {
    const dialogRef = this.dialog.open(AddCategoryDialogWrapperComponent, {
      width: '400px',
      data: { category }
    });

    dialogRef.afterClosed().subscribe((result: {name: string, id: string, isEdit: boolean} | null) => {
      if (result && result.isEdit && result.name.trim()) {
        this.taskFacade.updateCategory(result.id, { name: result.name.trim() });
      }
    });
  }

  public onDeleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      this.taskFacade.deleteCategory(id);
    }
  }
}
