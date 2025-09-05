import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FabButtonComponent } from '../../../shared/components/fab-button/fab-button.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ItemCardComponent } from '../../../shared/components/item-card/item-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ShoppingListFacadeService } from '../services/shopping-list-facade.service';
import { ShoppingCategory } from '../../../core/interfaces/shopping-category.model';
import { FormDialogComponent } from '../../../shared/components/form-dialog.component';
import { CategoryDialogConfigs } from '../configs/category-dialog.configs';

@Component({
  selector: 'app-categories-tab',
  standalone: true,
  imports: [
    CommonModule,
    FabButtonComponent,
    LoadingSpinnerComponent,
    ItemCardComponent,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './categories-tab.component.html',
  styleUrl: './categories-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesTabComponent {
  private readonly shoppingListFacade = inject(ShoppingListFacadeService);
  private readonly dialog = inject(MatDialog);

  // Expose facade signals directly
  public readonly categories = this.shoppingListFacade.categories;
  public readonly categoryLoading = this.shoppingListFacade.categoryLoading;
  public readonly categoryError = this.shoppingListFacade.categoryError;

  public openAddCategoryDialog(): void {
    const config = CategoryDialogConfigs.createAddCategoryConfig();
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: config,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.shoppingListFacade.addCategory(result);
        } catch (error) {
          console.error('Failed to add category:', error);
        }
      }
    });
  }

  public editCategory(category: ShoppingCategory): void {
    const config = CategoryDialogConfigs.createEditCategoryConfig(category);
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: config,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.shoppingListFacade.updateCategory(category.id, result);
        } catch (error) {
          console.error('Failed to update category:', error);
        }
      }
    });
  }

  public async deleteCategory(id: string): Promise<void> {
    try {
      await this.shoppingListFacade.deleteCategory(id);
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  }
}
