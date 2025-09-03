import { ShoppingListItem } from '../../../core/interfaces/shopping-list.model';

/**
 * Shopping List related utility functions
 */
export class ShoppingListUtils {
  /**
   * Sort shopping list items with purchased items at the bottom
   */
  public static sortItems(items: ShoppingListItem[] | unknown): ShoppingListItem[] {
    if (!Array.isArray(items)) {
      return [];
    }
    return items.slice().sort((a, b) => {
      // First sort by purchased status (unpurchased first)
      if (a.purchased !== b.purchased) {
        return a.purchased ? 1 : -1;
      }

      // Then sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  /**
   * Generate a temporary ID for optimistic updates
   */
  public static generateTempId(): string {
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Filter items by category
   */
  public static filterByCategory(items: ShoppingListItem[], categoryId: string): ShoppingListItem[] {
    if (categoryId === 'all') return items;
    return items.filter(item => item.categoryId === categoryId);
  }

  /**
   * Filter items by purchase status
   */
  public static filterByPurchaseStatus(items: ShoppingListItem[], purchased?: boolean): ShoppingListItem[] {
    if (purchased === undefined) return items;
    return items.filter(item => item.purchased === purchased);
  }

  /**
   * Get item status display text
   */
  public static getItemStatus(item: ShoppingListItem): string {
    return item.purchased ? 'Purchased' : 'Not Purchased';
  }

  /**
   * Get total quantity for all items
   */
  public static getTotalQuantity(items: ShoppingListItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Get purchased quantity
   */
  public static getPurchasedQuantity(items: ShoppingListItem[]): number {
    return items
      .filter(item => item.purchased)
      .reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Get unpurchased quantity
   */
  public static getUnpurchasedQuantity(items: ShoppingListItem[]): number {
    return items
      .filter(item => !item.purchased)
      .reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Calculate shopping progress percentage
   */
  public static getShoppingProgress(items: ShoppingListItem[]): number {
    if (items.length === 0) return 0;
    const purchasedCount = items.filter(item => item.purchased).length;
    return Math.round((purchasedCount / items.length) * 100);
  }
}
