import { Injectable, inject, signal, computed } from '@angular/core';
import { ShoppingListService } from '../../../core/services/shopping-list.service';
import { ShoppingCategoryService } from '../../../core/services/shopping-category.service';
import { ShoppingListItem } from '../../../core/interfaces/shopping-list.model';
import { ShoppingCategory } from '../../../core/interfaces/shopping-category.model';
import { DashboardCardFilter } from '../../../shared/models/dashboard-card-filter.model';
import { DashboardCardConfig } from '../../../shared/components/dashboard-summary-cards/dashboard-summary-cards.component';
import { ShoppingListUtils } from '../utils/shopping-list.utils';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListFacadeService {
  private readonly shoppingListService = inject(ShoppingListService);
  private readonly categoryService = inject(ShoppingCategoryService);

  // State signals
  private readonly _items = signal<ShoppingListItem[]>([]);
  private readonly _categories = signal<ShoppingCategory[]>([]);
  private readonly _selectedCategory = signal<string>('all');
  private readonly _dashboardFilter = signal<DashboardCardFilter>(DashboardCardFilter.All);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _categoryLoading = signal<boolean>(false);
  private readonly _categoryError = signal<string | null>(null);

  // Public readonly signals
  public readonly items = this._items.asReadonly();
  public readonly categories = this._categories.asReadonly();
  public readonly selectedCategory = this._selectedCategory.asReadonly();
  public readonly dashboardFilter = this._dashboardFilter.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly categoryLoading = this._categoryLoading.asReadonly();
  public readonly categoryError = this._categoryError.asReadonly();

  // Computed signals
  public readonly filteredItems = computed(() => {
    const allItems = this._items();
    const categoryFilter = this._selectedCategory();
    const dashFilter = this._dashboardFilter();

    let filtered = ShoppingListUtils.filterByCategory(allItems, categoryFilter);

    switch (dashFilter) {
      case DashboardCardFilter.Complete:
        filtered = ShoppingListUtils.filterByPurchaseStatus(filtered, true);
        break;
      case DashboardCardFilter.Incomplete:
        filtered = ShoppingListUtils.filterByPurchaseStatus(filtered, false);
        break;
      case DashboardCardFilter.All:
      default:
        break;
    }

    return ShoppingListUtils.sortItems(filtered);
  });

  public readonly dashboardCards = computed((): DashboardCardConfig[] => {
    const items = this._items();
    return [
      {
        title: 'Total Items',
        value: items.length,
        icon: 'list',
        color: '#9ca3af',
        filter: DashboardCardFilter.All,
      },
      {
        title: 'Purchased',
        value: ShoppingListUtils.filterByPurchaseStatus(items, true).length,
        icon: 'check_circle',
        color: '#22c55e',
        filter: DashboardCardFilter.Complete,
      },
      {
        title: 'Not Purchased',
        value: ShoppingListUtils.filterByPurchaseStatus(items, false).length,
        icon: 'radio_button_unchecked',
        color: '#fbbf24',
        filter: DashboardCardFilter.Incomplete,
      },
    ];
  });

  public readonly shoppingProgress = computed(() => {
    return ShoppingListUtils.getShoppingProgress(this._items());
  });

  public loadItems(): void {
    this._loading.set(true);
    this.shoppingListService.getAll().subscribe({
      next: (items) => {
        console.log('items',items)
        this._items.set(ShoppingListUtils.sortItems(items));
        this._loading.set(false);
        this._error.set(null);
      },
      error: (error) => {
        this._error.set('Failed to load shopping items.');
        this._loading.set(false);
        console.error('Error loading shopping items:', error);
      }
    });
  }

  public loadCategories(): void {
    this._categoryLoading.set(true);
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this._categories.set(categories);
        this._categoryLoading.set(false);
        this._categoryError.set(null);
      },
      error: (error) => {
        this._categoryError.set('Failed to load categories.');
        this._categoryLoading.set(false);
        console.error('Error loading categories:', error);
      }
    });
  }

  public setCategory(categoryId: string): void {
    this._selectedCategory.set(categoryId);
  }

  public setDashboardFilter(filter: DashboardCardFilter): void {
    this._dashboardFilter.set(filter);
  }

  public async addItem(itemData: Partial<ShoppingListItem>): Promise<void> {
    const tempId = ShoppingListUtils.generateTempId();
    const optimisticItem: ShoppingListItem = {
      ...itemData,
      id: tempId,
      purchased: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as ShoppingListItem;

    // Optimistic update
    this._items.update(items => ShoppingListUtils.sortItems([optimisticItem, ...items]));

    try {
      // Note: The shopping list service doesn't have a direct addItem method for standalone items
      // We need to use the updateItem method or create a new method
      // For now, I'll assume we need to add this to a default list or modify the service
      // This is a placeholder - you may need to adjust based on your backend implementation
      const createdItem = await firstValueFrom(this.shoppingListService.updateItem(tempId, itemData));
      if (createdItem) {
        // Replace temp item with real one
        this._items.update(items =>
          ShoppingListUtils.sortItems(items.map(item => item.id === tempId ? createdItem : item))
        );
      }
    } catch (error) {
      // Revert on error
      this._items.update(items => items.filter(item => item.id !== tempId));
      this._error.set('Failed to add item.');
      throw error;
    }
  }

  public async updateItem(id: string, changes: Partial<ShoppingListItem>): Promise<void> {
    const previousItems = this._items();

    // Optimistic update
    this._items.update(items =>
      ShoppingListUtils.sortItems(items.map(item => item.id === id ? { ...item, ...changes } : item))
    );

    try {
      await firstValueFrom(this.shoppingListService.updateItem(id, changes));
    } catch (error) {
      // Revert on error
      this._items.set(previousItems);
      this._error.set('Failed to update item.');
      throw error;
    }
  }

  public async deleteItem(id: string): Promise<void> {
    const previousItems = this._items();

    // Optimistic update
    this._items.update(items => items.filter(item => item.id !== id));

    try {
      await firstValueFrom(this.shoppingListService.deleteItem(id));
    } catch (error) {
      // Revert on error
      this._items.set(previousItems);
      this._error.set('Failed to delete item.');
      throw error;
    }
  }

  public async togglePurchased(id: string, purchased: boolean): Promise<void> {
    const previousItems = this._items();

    // Optimistic update
    this._items.update(items =>
      ShoppingListUtils.sortItems(items.map(item =>
        item.id === id ? { ...item, purchased, updatedAt: new Date().toISOString() } : item
      ))
    );

    try {
      await firstValueFrom(this.shoppingListService.updateItem(id, { purchased }));
    } catch (error) {
      // Revert on error
      this._items.set(previousItems);
      this._error.set('Failed to update item status.');
      throw error;
    }
  }

  // Category management methods
  public async addCategory(categoryData: Partial<ShoppingCategory>): Promise<void> {
    const tempId = 'temp-' + Math.random().toString(36).substr(2, 9);
    const optimisticCategory: ShoppingCategory = {
      ...categoryData,
      id: tempId,
      name: categoryData.name || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as ShoppingCategory;

    // Optimistic update
    this._categories.update(categories => [...categories, optimisticCategory]);

    try {
      const createdCategory = await firstValueFrom(this.categoryService.create(categoryData));
      // Replace temp category with real one
      this._categories.update(categories =>
        categories.map(cat => cat.id === tempId ? createdCategory : cat)
      );
      this._categoryError.set(null);
    } catch (error) {
      // Revert on error
      this._categories.update(categories => categories.filter(cat => cat.id !== tempId));
      this._categoryError.set('Failed to add category.');
      throw error;
    }
  }

  public async updateCategory(id: string, changes: Partial<ShoppingCategory>): Promise<void> {
    const previousCategories = this._categories();

    // Optimistic update
    this._categories.update(categories =>
      categories.map(cat => cat.id === id ? { ...cat, ...changes } : cat)
    );

    try {
      await firstValueFrom(this.categoryService.update(id, changes));
    } catch (error) {
      // Revert on error
      this._categories.set(previousCategories);
      this._categoryError.set('Failed to update category.');
      throw error;
    }
  }

  public async deleteCategory(id: string): Promise<void> {
    const previousCategories = this._categories();

    // Optimistic update
    this._categories.update(categories => categories.filter(cat => cat.id !== id));

    try {
      await firstValueFrom(this.categoryService.delete(id));
    } catch (error) {
      // Revert on error
      this._categories.set(previousCategories);
      this._categoryError.set('Failed to delete category.');
      throw error;
    }
  }
}
