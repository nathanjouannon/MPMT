export interface User {
  id: number;
  username: string;
  email?: string;
  createdAt?: string;
}

export interface TaskAssignment {
  id: number;
  user: User;
}

export interface HistoryEntry {
  id: number;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  changedAt: string;
  user: User;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'RETRO' | 'DONE';
  priority: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  dueDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  assignments?: TaskAssignment[];
  history?: HistoryEntry[];
}
