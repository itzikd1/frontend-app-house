import { Validators } from '@angular/forms';
import { FormDialogConfig } from '../../../shared/components/form-dialog.component';
import { ShoppingCategory } from '../../../core/interfaces/shopping-category.model';

export class CategoryDialogConfigs {
  static createAddCategoryConfig(): FormDialogConfig {
    return {
      title: 'Add Shopping Category',
      submitLabel: 'Add Category',
      fields: [
        {
          key: 'name',
          label: 'Category Name',
          type: 'text',
          required: true,
          validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
          placeholder: 'Enter category name'
        },
        {
          key: 'description',
          label: 'Description',
          type: 'textarea',
          required: false,
          placeholder: 'Optional description for this category',
          rows: 3
        }
      ]
    };
  }

  static createEditCategoryConfig(category: ShoppingCategory): FormDialogConfig {
    const config = this.createAddCategoryConfig();
    return {
      ...config,
      title: 'Edit Shopping Category',
      submitLabel: 'Update Category',
      initialData: {
        name: category.name,
        description: category.description || ''
      }
    };
  }
}
