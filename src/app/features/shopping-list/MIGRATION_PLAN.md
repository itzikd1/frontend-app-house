# Shopping List Feature Migration Plan

This plan outlines the migration of the shopping-list feature to follow the architecture patterns documented in the tasks README.

## Current State Analysis

### ✅ Already Implemented (Following Patterns)
- Facade service with signal-based state management
- Utility class with pure functions
- OnPush change detection strategy
- Standalone components (main component)
- Loading and error state management
- Optimistic updates in facade
- Dashboard summary cards integration

### ❌ Needs Migration/Implementation

1. **Module to Standalone Architecture**
   - Remove shopping-list.module.ts
   - Convert dialog components to standalone
   - Update imports to be standalone-based

2. **Tab Structure Implementation**
   - Create proper tab-based structure with type-safe tab IDs
   - Implement shopping-list-tab/ and categories-tab/ components
   - Move existing logic to appropriate tab components

3. **Dialog Configuration Classes**
   - Create shopping-list-dialog.configs.ts
   - Create category-dialog.configs.ts  
   - Implement static factory methods for dialog configurations

4. **Component Structure Reorganization**
   - Separate main container (shopping-list.component) from tab logic
   - Create individual tab components following the pattern

5. **Type Safety Improvements**
   - Add const assertions for tab IDs
   - Implement type guards
   - Add proper union types

6. **Shared Component Integration**
   - Add category filter component
   - Ensure consistent use of shared components

## Migration Implementation Order

### Phase 1: Core Structure Setup
- [ ] 1.1 Create tab ID constants and types
- [ ] 1.2 Update main shopping-list.component to be tab container
- [ ] 1.3 Create shopping-list-tab/ component directory
- [ ] 1.4 Create categories-tab/ component directory

### Phase 2: Component Migration
- [ ] 2.1 Convert existing dialog components to standalone
- [ ] 2.2 Create shopping-list-tab.component with current items logic
- [ ] 2.3 Create categories-tab.component for category management
- [ ] 2.4 Update main component to manage tabs only

### Phase 3: Dialog Configuration
- [ ] 3.1 Create configs/shopping-list-dialog.configs.ts
- [ ] 3.2 Create configs/category-dialog.configs.ts
- [ ] 3.3 Update dialog integration to use config classes
- [ ] 3.4 Remove old dialog wrapper components

### Phase 4: Facade Service Enhancement
- [ ] 4.1 Review and enhance facade service patterns
- [ ] 4.2 Add any missing state management
- [ ] 4.3 Ensure proper error handling patterns

### Phase 5: Utility Enhancement
- [ ] 5.1 Review and enhance utility class
- [ ] 5.2 Add any missing utility functions
- [ ] 5.3 Ensure all functions are pure

### Phase 6: Filter Component
- [ ] 6.1 Create shopping-category-filter/ component
- [ ] 6.2 Integrate filter component into tabs
- [ ] 6.3 Update facade to handle filter state

### Phase 7: Cleanup and Testing
- [ ] 7.1 Remove shopping-list.module.ts
- [ ] 7.2 Update routing if needed
- [ ] 7.3 Fix all TypeScript/Angular CLI errors
- [ ] 7.4 Test all functionality works correctly

## Target Structure

After migration, the structure should look like:

```
shopping-list/
├── shopping-list.component.ts          # Main container with tabs
├── shopping-list.component.html
├── shopping-list.component.scss
├── shopping-list-tab/                  # Items tab
│   ├── shopping-list-tab.component.ts
│   ├── shopping-list-tab.component.html
│   └── shopping-list-tab.component.scss
├── categories-tab/                     # Categories tab
│   ├── categories-tab.component.ts
│   ├── categories-tab.component.html
│   └── categories-tab.component.scss
├── shopping-category-filter/           # Filter component
│   ├── shopping-category-filter.component.ts
│   ├── shopping-category-filter.component.html
│   └── shopping-category-filter.component.scss
├── services/
│   └── shopping-list-facade.service.ts # Enhanced facade
├── configs/
│   ├── shopping-list-dialog.configs.ts # Dialog configs
│   └── category-dialog.configs.ts
└── utils/
    └── shopping-list.utils.ts          # Enhanced utilities
```

## Key Pattern Implementations

### 1. Tab Structure Pattern
```typescript
const SHOPPING_LIST_TAB_ID = 'shopping-list' as const;
const CATEGORIES_TAB_ID = 'categories' as const;
type ShoppingListTabId = typeof SHOPPING_LIST_TAB_ID | typeof CATEGORIES_TAB_ID;
```

### 2. Dialog Configuration Pattern
```typescript
export class ShoppingListDialogConfigs {
  static createAddItemConfig(categories: ShoppingCategory[]): FormDialogConfig {
    // Implementation
  }
  
  static createEditItemConfig(item: ShoppingListItem, categories: ShoppingCategory[]): FormDialogConfig {
    // Implementation  
  }
}
```

### 3. Component State Exposure Pattern
```typescript
export class ShoppingListTabComponent {
  private readonly shoppingListFacade = inject(ShoppingListFacadeService);
  
  // Expose facade signals directly
  public readonly items = this.shoppingListFacade.filteredItems;
  public readonly loading = this.shoppingListFacade.loading;
  // ...
}
```

Let's begin implementation!
