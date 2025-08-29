export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface Task extends BaseModel {
  title: string;
  description?: string;
  category?: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  repeat?: string;
}

export {}
