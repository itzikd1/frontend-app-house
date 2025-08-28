export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface Task extends BaseModel {
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  priority: 'Low' | 'Medium' | 'High';
  repeatFrequency?: string;
  categoryId?: string;
  userId: string;
}

export {}
