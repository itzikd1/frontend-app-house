import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { TabSwitcherComponent } from '../../shared/components/tab-switcher/tab-switcher.component';
import { TabOption } from '../../shared/components/tab-switcher/tab-switcher.component';
import { ShoppingListTabComponent } from './shopping-list-tab/shopping-list-tab.component';
import { CategoriesTabComponent } from './categories-tab/categories-tab.component';
import { ShoppingListFacadeService } from './services/shopping-list-facade.service';

// Tab constants for type safety
const SHOPPING_LIST_TAB_ID = 'shopping-list' as const;
const CATEGORIES_TAB_ID = 'categories' as const;
type ShoppingListTabId = typeof SHOPPING_LIST_TAB_ID | typeof CATEGORIES_TAB_ID;

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [
    CommonModule,
    TabSwitcherComponent,
    ShoppingListTabComponent,
    CategoriesTabComponent,
  ],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShoppingListComponent {
  private readonly shoppingListFacade = inject(ShoppingListFacadeService);

  public readonly selectedTab = signal<ShoppingListTabId>(SHOPPING_LIST_TAB_ID);
  public readonly tabOptions: TabOption[] = [
    { id: SHOPPING_LIST_TAB_ID, label: 'Shopping List' },
    { id: CATEGORIES_TAB_ID, label: 'Categories' },
  ] as const;

  constructor() {
    // Initialize data loading
    this.shoppingListFacade.loadItems();
    this.shoppingListFacade.loadCategories();
  }

  public onTabChange(tabId: string): void {
    if (this.isValidTab(tabId)) {
      this.selectedTab.set(tabId);
    }
  }

  private isValidTab(tab: string): tab is ShoppingListTabId {
    return tab === SHOPPING_LIST_TAB_ID || tab === CATEGORIES_TAB_ID;
  }
}
