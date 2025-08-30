export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  purchased: boolean;
  createdAt: string;
  updatedAt: string;
}


