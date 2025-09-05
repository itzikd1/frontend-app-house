import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TabSwitcherComponent } from '../../shared/components/tab-switcher/tab-switcher.component';
import { RecipesTabComponent } from './recipes-tab/recipes-tab.component';
import { RecipeFacadeService } from './services/recipe-facade.service';
import { signal } from '@angular/core';

// Tab constants for type safety
const RECIPES_TAB_ID = 'recipes' as const;
const CATEGORIES_TAB_ID = 'categories' as const;

type RecipeTabId = typeof RECIPES_TAB_ID | typeof CATEGORIES_TAB_ID;

interface TabOption {
  id: RecipeTabId;
  label: string;
}

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    CommonModule,
    TabSwitcherComponent,
    RecipesTabComponent,
    MatIconModule,
  ],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipesComponent implements OnInit {
  private readonly recipeFacade = inject(RecipeFacadeService);

  // Tab management
  public readonly selectedTab = signal<RecipeTabId>(RECIPES_TAB_ID);
  public readonly tabOptions: TabOption[] = [
    { id: RECIPES_TAB_ID, label: 'Recipes' },
    { id: CATEGORIES_TAB_ID, label: 'Categories' },
  ];

  // Tab constants for template
  public readonly RECIPES_TAB_ID = RECIPES_TAB_ID;
  public readonly CATEGORIES_TAB_ID = CATEGORIES_TAB_ID;

  ngOnInit(): void {
    // Load initial data
    this.recipeFacade.loadRecipes();
  }

  /**
   * Handle tab change with type safety
   */
  public onTabChange(tabId: string): void {
    if (this.isValidTab(tabId)) {
      this.selectedTab.set(tabId);
    }
  }

  /**
   * Type guard for valid tab IDs
   */
  private isValidTab(tab: string): tab is RecipeTabId {
    return tab === RECIPES_TAB_ID || tab === CATEGORIES_TAB_ID;
  }
}
