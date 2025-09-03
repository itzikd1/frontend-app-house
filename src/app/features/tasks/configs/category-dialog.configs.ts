import { Validators } from '@angular/forms';
import { FormDialogConfig } from '../../../shared/components/form-dialog.component';
import { TaskCategory } from '../../../core/interfaces/item-category.model';

export class CategoryDialogConfigs {
  static createAddCategoryConfig(): FormDialogConfig {
    return {
      title: 'Add New Category',
      submitLabel: 'Add Category',
      fields: [
        {
          key: 'name',
          label: 'Category Name',
          type: 'text',
          required: true,
          validators: [Validators.required, Validators.minLength(1)],
          placeholder: 'Enter category name'
        }
      ]
    };
  }

  static createEditCategoryConfig(category: TaskCategory): FormDialogConfig {
    const config = this.createAddCategoryConfig();
    return {
      ...config,
      title: 'Edit Category',
      submitLabel: 'Update Category',
      initialData: {
        name: category.name
      }
    };
  }
}
