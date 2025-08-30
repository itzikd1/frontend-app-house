import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from '../../core/services/shopping-list.service';
import { AddShoppingListDialogWrapperComponent } from './add-shopping-list-dialog-wrapper.component';
import { ShoppingListItem } from '../../shared/models/shopping-list.model';
import { signal, computed } from '@angular/core';
import {FabButtonComponent} from '../../shared/components/fab-button/fab-button.component';
import {LoadingSpinnerComponent} from '../../shared/components/loading-spinner/loading-spinner.component';
import {ItemCardComponent} from '../../shared/components/item-card/item-card.component';
import { ShoppingCategoryService, ShoppingCategory } from '../../core/services/shopping-category.service';
import { DashboardSummaryCardsComponent } from '../../shared/components/dashboard-summary-cards/dashboard-summary-cards.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatCard, MatCardActions, MatCardContent} from '@angular/material/card';

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
  private shoppingListService = inject(ShoppingListService);
  private shoppingCategoryService = inject(ShoppingCategoryService);
  private dialog = inject(MatDialog);

  shoppingItems = signal<ShoppingListItem[]>([]);
  loading = signal(false);

  // Category and tab state
  categories = signal<ShoppingCategory[]>([]);
  categoryLoading = signal(false);
  categoryError = signal<string | null>(null);
  selectedTab = signal<'items' | 'categories'>('items');
  selectedCategory = signal<string>('all');
  dashboardFilter = signal<'all' | 'complete' | 'uncomplete'>('all');

  // Category form state
  editingCategory = signal<ShoppingCategory | null>(null);
  categoryFormName = signal<string>('');

  constructor() {
    this.loadInitialItems();
    this.loadCategories();
  }

  private loadInitialItems(): void {
    this.loading.set(true);
    this.shoppingListService.getAll().subscribe({
      next: items => {
        this.shoppingItems.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  private loadCategories(): void {
    this.categoryLoading.set(true);
    this.shoppingCategoryService.getAll().subscribe({
      next: categories => {
        this.categories.set(categories);
        this.categoryLoading.set(false);
      },
      error: () => {
        this.categoryError.set('Failed to load categories');
        this.categoryLoading.set(false);
      }
    });
  }

  setTab(tab: 'items' | 'categories'): void {
    this.selectedTab.set(tab);
  }

  setCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId);
  }

  setDashboardFilter(filter: 'all' | 'complete' | 'uncomplete' | 'overdue'): void {
    // Only allow valid filters for shopping-list
    if (filter === 'all' || filter === 'complete' || filter === 'uncomplete') {
      this.dashboardFilter.set(filter);
    }
  }

  addCategory(): void {
    const name = this.categoryFormName();
    if (!name.trim()) return;
    this.categoryLoading.set(true);
    this.shoppingCategoryService.create({ name }).subscribe({
      next: () => {
        this.categoryFormName.set('');
        this.loadCategories();
        this.categoryLoading.set(false);
      },
      error: () => {
        this.categoryError.set('Failed to add category');
        this.categoryLoading.set(false);
      }
    });
  }

  editCategory(category: ShoppingCategory): void {
    this.editingCategory.set(category);
    this.categoryFormName.set(category.name);
  }

  updateCategory(): void {
    const category = this.editingCategory();
    const name = this.categoryFormName();
    if (!category || !name.trim()) return;
    this.categoryLoading.set(true);
    this.shoppingCategoryService.update(category.id, { name }).subscribe({
      next: () => {
        this.editingCategory.set(null);
        this.categoryFormName.set('');
        this.loadCategories();
        this.categoryLoading.set(false);
      },
      error: () => {
        this.categoryError.set('Failed to update category');
        this.categoryLoading.set(false);
      }
    });
  }

  deleteCategory(id: string): void {
    this.categoryLoading.set(true);
    this.shoppingCategoryService.delete(id).subscribe({
      next: () => {
        this.loadCategories();
        this.categoryLoading.set(false);
      },
      error: () => {
        this.categoryError.set('Failed to delete category');
        this.categoryLoading.set(false);
      }
    });
  }

  // Filtered items by category and dashboard filter
  filteredItems = computed(() => {
    let items: ShoppingListItem[] = this.shoppingItems() ?? [];
    if (!Array.isArray(items)) {
      return [];
    }
    const categoryId = this.selectedCategory();
    if (categoryId !== 'all') {
      items = items.filter((item: ShoppingListItem) => item.categoryId === categoryId);
    }
    switch (this.dashboardFilter()) {
      case 'complete':
        items = items.filter((item: ShoppingListItem) => item.purchased);
        break;
      case 'uncomplete':
        items = items.filter((item: ShoppingListItem) => !item.purchased);
        break;
    }
    return items;
  });

  dashboardCards = computed(() => {
    const items: ShoppingListItem[] = this.shoppingItems() ?? [];
    return [
      {
        title: 'All',
        value: items.length,
        icon: 'list',
        color: '#1976d2',
        filter: 'all' as const,
      },
      {
        title: 'Purchased',
        value: items.filter((i: ShoppingListItem) => i.purchased).length,
        icon: 'check_circle',
        color: '#43a047',
        filter: 'complete' as const,
      },
      {
        title: 'Unpurchased',
        value: items.filter((i: ShoppingListItem) => !i.purchased).length,
        icon: 'remove_circle',
        color: '#e53935',
        filter: 'uncomplete' as const,
      },
    ];
  });

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddShoppingListDialogWrapperComponent);
    dialogRef.afterClosed().subscribe((result: unknown) => {
      if (result) {
        this.reloadItems();
      }
    });
  }

  editList(item: ShoppingListItem): void {
    const dialogRef = this.dialog.open(AddShoppingListDialogWrapperComponent, { data: item });
    dialogRef.afterClosed().subscribe((result: unknown) => {
      if (result) {
        this.reloadItems();
      }
    });
  }

  deleteList(id: string): void {
    this.loading.set(true);
    this.shoppingListService.delete(id).subscribe({
      next: () => {
        this.reloadItems();
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  togglePurchased(item: ShoppingListItem, purchased: boolean): void {
    this.loading.set(true);
    this.shoppingListService.updateItem(item.id, { purchased }).subscribe({
      next: () => {
        this.reloadItems();
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  private reloadItems(): void {
    this.loading.set(true);
    this.shoppingListService.getAll().subscribe({
      next: (items: ShoppingListItem[]) => {
        this.shoppingItems.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
