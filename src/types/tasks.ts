export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  companyId: string;
  title: string;
  description: string;
  category: 'onboarding' | 'banking' | 'compliance';
  country: string;
  relatedAccountId?: string;
  status: TaskStatus;
  createdAt: string;
  dueDate?: string;
}

