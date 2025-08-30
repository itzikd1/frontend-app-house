export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string | null;
  progress: number;
  isCompleted: boolean;
  completedAt: string | null;
  userId: string;
  familyId: string | null;
  createdAt: string;
  updatedAt: string;
}
