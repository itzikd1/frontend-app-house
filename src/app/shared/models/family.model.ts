
export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface User extends BaseModel {
  name: string;
  email: string;
  role: 'ADMIN' | 'FAMILY_HEAD' | 'FAMILY_MEMBER';
  familyId?: string;
}

export interface Family extends BaseModel {
  name: string;
  members: User[];
  createdById: string;
}
