import {TaskCategory} from './item-category.model';

export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface Task extends BaseModel {
  title: string;
  description?: string;
  categoryId?: string;
  category?: TaskCategory;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string | null;
  repeat?: string;
  completed: boolean;
}

export {}
