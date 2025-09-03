import { Validators } from '@angular/forms';
import { FormDialogConfig } from '../../../shared/components/form-dialog.component';
import { ShoppingListItem } from '../../../core/interfaces/shopping-list.model';
import { ShoppingCategory } from '../../../core/interfaces/shopping-category.model';

export class ShoppingListDialogConfigs {
  static createAddItemConfig(categories: ShoppingCategory[]): FormDialogConfig {
    return {
      title: 'Add Shopping Item',
      submitLabel: 'Add Item',
      fields: [
        {
          key: 'name',
          label: 'Item Name',
          type: 'text',
          required: true,
          validators: [Validators.required, Validators.minLength(1)],
          placeholder: 'Enter item name'
        },
        {
          key: 'quantity',
          label: 'Quantity',
          type: 'number',
          required: true,
          validators: [Validators.required, Validators.min(1)],
          placeholder: 'Enter quantity',
          defaultValue: 1
        },
        {
          key: 'categoryId',
          label: 'Category',
          type: 'select',
          required: false,
          placeholder: 'Select a category',
          options: [
            { value: '', label: 'No Category' },
            ...categories.map(cat => ({ value: cat.id, label: cat.name }))
          ]
        },
        {
          key: 'notes',
          label: 'Notes',
          type: 'textarea',
          required: false,
          placeholder: 'Additional notes (optional)',
          rows: 3
        }
      ]
    };
  }

  static createEditItemConfig(item: ShoppingListItem, categories: ShoppingCategory[]): FormDialogConfig {
    const config = this.createAddItemConfig(categories);
    return {
      ...config,
      title: 'Edit Shopping Item',
      submitLabel: 'Update Item',
      initialData: {
        name: item.name,
        quantity: item.quantity,
        categoryId: item.categoryId || '',
        notes: item.notes || ''
      }
    };
  }
}
