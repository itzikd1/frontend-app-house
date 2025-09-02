import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AddShoppingListDialogWrapperComponent } from './add-shopping-list-dialog-wrapper.component';
import { ShoppingListItem } from '../../core/interfaces/shopping-list.model';
import { signal } from '@angular/core';
import { FabButtonComponent } from '../../shared/components/fab-button/fab-button.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ItemCardComponent } from '../../shared/components/item-card/item-card.component';
import { DashboardSummaryCardsComponent } from '../../shared/components/dashboard-summary-cards/dashboard-summary-cards.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { ShoppingCategory } from '../../core/interfaces/shopping-category.model';
import { DashboardCardFilter } from '../../shared/models/dashboard-card-filter.model';
import { ShoppingListFacadeService } from './services/shopping-list-facade.service';
import { AddCategoryDialogWrapperComponent } from './add-category-dialog-wrapper.component';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    FabButtonComponent,
    LoadingSpinnerComponent,
    ItemCardComponent,
    DashboardSummaryCardsComponent,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardContent,
    MatCard,
    MatCardActions,
  ],
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShoppingListComponent {
  private readonly facade = inject(ShoppingListFacadeService);
  private readonly dialog = inject(MatDialog);

  // Expose facade signals
  readonly items = this.facade.filteredItems;
  readonly allItems = this.facade.items; // Add this for the "All" button count
  readonly categories = this.facade.categories;
  readonly loading = this.facade.loading;
  readonly error = this.facade.error;
  readonly categoryLoading = this.facade.categoryLoading;
  readonly categoryError = this.facade.categoryError;
  readonly dashboardCards = this.facade.dashboardCards;
  readonly selectedCategory = this.facade.selectedCategory;
  readonly dashboardFilter = this.facade.dashboardFilter;
  readonly shoppingProgress = this.facade.shoppingProgress;

  // Tab state
  readonly selectedTab = signal<'items' | 'categories'>('items');

  constructor() {
    this.facade.loadItems();
    console.log(this.allItems(), 'allItems')
    this.facade.loadCategories();
  }

  setTab(tab: 'items' | 'categories'): void {
    this.selectedTab.set(tab);
  }

  setCategory(categoryId: string): void {
    this.facade.setCategory(categoryId);
  }

  setDashboardFilter(filter: DashboardCardFilter): void {
    if (
      filter === DashboardCardFilter.All ||
      filter === DashboardCardFilter.Complete ||
      filter === DashboardCardFilter.Incomplete
    ) {
      this.facade.setDashboardFilter(filter);
    }
  }

  openAddCategoryDialog(): void {
    console.log('click')
    const dialogRef = this.dialog.open(AddCategoryDialogWrapperComponent);
    dialogRef.afterClosed().subscribe(async (result: { name: string } | undefined) => {
      if (result && result.name.trim()) {
        try {
          await this.facade.addCategory({ name: result.name.trim() });
        } catch (error) {
          // handle error (could show a toast/snackbar)
        }
      }
    });
  }

  openEditCategoryDialog(category: ShoppingCategory): void {
    const dialogRef = this.dialog.open(AddCategoryDialogWrapperComponent, {
      data: { category }
    });
    dialogRef.afterClosed().subscribe(async (result: { name: string } | undefined) => {
      if (result && result.name.trim()) {
        try {
          await this.facade.updateCategory(category.id, { name: result.name.trim() });
        } catch (error) {
          // handle error (could show a toast/snackbar)
        }
      }
    });
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await this.facade.deleteCategory(id);
    } catch (error) {
      // handle error (could show a toast/snackbar)
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddShoppingListDialogWrapperComponent);
    dialogRef.afterClosed().subscribe((result: unknown) => {
      if (result) {
        // The facade handles optimistic updates, so we don't need to reload
        // But we could reload if needed: this.facade.loadItems();
      }
    });
  }

  editList(item: ShoppingListItem): void {
    const dialogRef = this.dialog.open(AddShoppingListDialogWrapperComponent, { data: item });
    dialogRef.afterClosed().subscribe((result: unknown) => {
      if (result) {
        // The facade handles optimistic updates, so we don't need to reload
      }
    });
  }

  async deleteList(id: string): Promise<void> {
    try {
      await this.facade.deleteItem(id);
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  }

  async togglePurchased(item: ShoppingListItem, purchased: boolean): Promise<void> {
    try {
      await this.facade.togglePurchased(item.id, purchased);
    } catch (error) {
      console.error('Failed to toggle purchase status:', error);
    }
  }

  filteredItems(): ShoppingListItem[] {
    return this.facade.filteredItems();
  }
}
