export interface Goal {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

