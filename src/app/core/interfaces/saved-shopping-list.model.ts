export interface SavedShoppingList {
  id: string;
  name: string;
  items: SavedShoppingListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface SavedShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  checked: boolean;
  createdAt: string;
  updatedAt: string;
}

