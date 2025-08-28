export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  color?: string;
  userId?: string;
  familyId?: string | null;
}

