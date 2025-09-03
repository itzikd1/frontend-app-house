import { Validators } from '@angular/forms';
import {FormDialogConfig} from '../../../shared/components/form-dialog.component';
import {TaskCategory} from '../../../core/interfaces/item-category.model';
import { Task } from "../../../core/interfaces/task.model";

export class TaskDialogConfigs {
  static createAddTaskConfig(categories: TaskCategory[]): FormDialogConfig {
    return {
      title: 'Add New Task',
      submitLabel: 'Add Task',
      fields: [
        {
          key: 'title',
          label: 'Title',
          type: 'text',
          required: true,
          validators: [Validators.required, Validators.minLength(1)],
          placeholder: 'Enter task title'
        },
        {
          key: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Enter task description (optional)'
        },
        {
          key: 'categoryId',
          label: 'Category',
          type: 'select',
          options: categories.map(cat => ({
            value: cat.id.toString(),
            label: cat.name
          }))
        },
        {
          key: 'priority',
          label: 'Priority',
          type: 'select',
          options: [
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' }
          ]
        },
        {
          key: 'repeatFrequency',
          label: 'Repeat',
          type: 'select',
          options: [
            { value: 'None', label: 'None' },
            { value: 'Daily', label: 'Daily' },
            { value: 'Weekly', label: 'Weekly' },
            { value: 'Monthly', label: 'Monthly' }
          ]
        },
        {
          key: 'dueDate',
          label: 'Due Date',
          type: 'date'
        }
      ]
    };
  }

  static createEditTaskConfig(task: Task, categories: TaskCategory[]): FormDialogConfig {
    const config = this.createAddTaskConfig(categories);
    return {
      ...config,
      title: 'Edit Task',
      submitLabel: 'Update Task',
      initialData: {
        title: task.title,
        description: task.description || '',
        categoryId: String(task.categoryId ?? task.category?.id ?? ''),
        priority: task.priority || 'Medium',
        repeatFrequency: task.repeatFrequency || 'None',
        dueDate: task.dueDate || ''
      }
    };
  }
}
