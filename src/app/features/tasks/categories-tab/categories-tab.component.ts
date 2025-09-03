import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TaskCategory } from '../../../core/interfaces/item-category.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ItemCardComponent } from '../../../shared/components/item-card/item-card.component';
import { TaskFacadeService } from '../services/task-facade.service';
import { FormDialogService } from '../../../shared/services/form-dialog.service';
import { CategoryDialogConfigs } from '../configs/category-dialog.configs';

@Component({
  selector: 'app-categories-tab',
  templateUrl: './categories-tab.component.html',
  styleUrls: ['./categories-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatIconModule, LoadingSpinnerComponent, ItemCardComponent]
})
export class CategoriesTabComponent {
  private readonly formDialogService = inject(FormDialogService);
  private readonly taskFacade = inject(TaskFacadeService);

  // Expose facade signals directly
  public readonly categories = this.taskFacade.categories;
  public readonly categoryLoading = this.taskFacade.categoryLoading;
  public readonly categoryError = this.taskFacade.categoryError;


  public onAddCategory(): void {
    const config = CategoryDialogConfigs.createAddCategoryConfig();

    this.formDialogService.openFormDialog(config).subscribe(result => {
      if (result && typeof result['name'] === 'string') {
        this.taskFacade.createCategory({ name: result['name'].trim() });
      }
    });
  }

  public onEditCategory(category: TaskCategory): void {
    const config = CategoryDialogConfigs.createEditCategoryConfig(category);

    this.formDialogService.openFormDialog(config).subscribe(result => {
      if (result && typeof result['name'] === 'string') {
        this.taskFacade.updateCategory(category.id, { name: result['name'].trim() });
      }
    });
  }

  public onDeleteCategory(id: string): void {
      this.taskFacade.deleteCategory(id);
  }
}
