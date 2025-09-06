export interface Task {
  id?: string;
  name: string;
  assignee: string;
  tags: string[];
  deadline: string;
  imageUrl?: string;
  description: string;
  project: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'completed';
  createdAt: any;
  updatedAt?: any;
  userId: string;
}

export interface CreateTaskData {
  name: string;
  assignee: string;
  tags: string;
  deadline: string;
  description: string;
  project: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'completed';
  image?: File;
}

export interface UpdateTaskData extends CreateTaskData {
  id: string;
  imageUrl?: string;
}
