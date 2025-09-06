import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FabButtonComponent } from '../../../shared/components/fab-button/fab-button.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ItemCardComponent } from '../../../shared/components/item-card/item-card.component';
import { DashboardSummaryCardsComponent } from '../../../shared/components/dashboard-summary-cards/dashboard-summary-cards.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ShoppingListFacadeService } from '../services/shopping-list-facade.service';
import { ShoppingListItem } from '../../../core/interfaces/shopping-list.model';
import { DashboardCardFilter } from '../../../shared/models/dashboard-card-filter.model';
import { FormDialogComponent } from '../../../shared/components/form-dialog.component';
import { ShoppingListDialogConfigs } from '../configs/shopping-list-dialog.configs';

@Component({
  selector: 'app-shopping-list-tab',
  standalone: true,
  imports: [
    CommonModule,
    FabButtonComponent,
    LoadingSpinnerComponent,
    ItemCardComponent,
    DashboardSummaryCardsComponent,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './shopping-list-tab.component.html',
  styleUrl: './shopping-list-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShoppingListTabComponent {
  private readonly shoppingListFacade = inject(ShoppingListFacadeService);
  private readonly dialog = inject(MatDialog);

  // Expose facade signals directly
  public readonly items = this.shoppingListFacade.filteredItems;
  public readonly allItems = this.shoppingListFacade.items;
  public readonly categories = this.shoppingListFacade.categories;
  public readonly loading = this.shoppingListFacade.loading;
  public readonly error = this.shoppingListFacade.error;
  public readonly dashboardCards = this.shoppingListFacade.dashboardCards;
  public readonly selectedCategory = this.shoppingListFacade.selectedCategory;
  public readonly dashboardFilter = this.shoppingListFacade.dashboardFilter;
  public readonly shoppingProgress = this.shoppingListFacade.shoppingProgress;

  public setCategory(categoryId: string): void {
    this.shoppingListFacade.setCategory(categoryId);
  }

  public setDashboardFilter(filter: DashboardCardFilter): void {
    if (
      filter === DashboardCardFilter.All ||
      filter === DashboardCardFilter.Complete ||
      filter === DashboardCardFilter.Incomplete
    ) {
      this.shoppingListFacade.setDashboardFilter(filter);
    }
  }

  public openAddDialog(): void {
    const config = ShoppingListDialogConfigs.createAddItemConfig(this.categories());
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: config,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.shoppingListFacade.addItem(result);
        } catch (error) {
          console.error('Failed to add item:', error);
        }
      }
    });
  }

  public editItem(item: ShoppingListItem): void {
    const config = ShoppingListDialogConfigs.createEditItemConfig(item, this.categories());
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: config,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.shoppingListFacade.updateItem(item.id, result);
        } catch (error) {
          console.error('Failed to update item:', error);
        }
      }
    });
  }

  public async deleteItem(id: string): Promise<void> {
    try {
      await this.shoppingListFacade.deleteItem(id);
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  }

  public async togglePurchased(item: ShoppingListItem, purchased: boolean): Promise<void> {
    try {
      await this.shoppingListFacade.togglePurchased(item.id, purchased);
    } catch (error) {
      console.error('Failed to toggle purchase status:', error);
    }
  }

  // Helper to get category name by ID
  public getCategoryName(categoryId: string | null | undefined): string {
    if (!categoryId) {
      return 'Uncategorized';
    }
    const category = this.categories().find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  // Helper to format date
  public formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
