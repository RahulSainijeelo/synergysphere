import { Task, CreateTaskData, UpdateTaskData } from '@/types/task';

export class TaskService {
  
  // Create a new task
  static async createTask(taskData: CreateTaskData, userId: string): Promise<Task> {
    const formData = new FormData();
    
    // Add all task fields to FormData
    formData.append('name', taskData.name);
    formData.append('assignee', taskData.assignee);
    formData.append('tags', taskData.tags);
    formData.append('deadline', taskData.deadline);
    formData.append('description', taskData.description);
    formData.append('project', taskData.project);
    formData.append('priority', taskData.priority);
    formData.append('status', taskData.status);
    formData.append('userId', userId);
    
    // Add image file if present
    if (taskData.image) {
      formData.append('image', taskData.image);
    }

    const response = await fetch('/api/tasks', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create task');
    }

    return response.json();
  }

  // Get all tasks for a user
  static async getTasks(userId: string): Promise<Task[]> {
    const response = await fetch(`/api/tasks?userId=${userId}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch tasks');
    }

    return response.json();
  }

  // Get a single task by ID
  static async getTask(id: string): Promise<Task> {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch task');
    }

    return response.json();
  }

  // Update an existing task
  static async updateTask(taskData: UpdateTaskData): Promise<Task> {
    const formData = new FormData();
    
    // Add all task fields to FormData
    formData.append('name', taskData.name);
    formData.append('assignee', taskData.assignee);
    formData.append('tags', taskData.tags);
    formData.append('deadline', taskData.deadline);
    formData.append('description', taskData.description);
    formData.append('project', taskData.project);
    formData.append('priority', taskData.priority);
    formData.append('status', taskData.status);
    
    // Add current image URL if exists
    if (taskData.imageUrl) {
      formData.append('currentImageUrl', taskData.imageUrl);
    }
    
    // Add new image file if present
    if (taskData.image) {
      formData.append('image', taskData.image);
    }

    const response = await fetch(`/api/tasks/${taskData.id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update task');
    }

    return response.json();
  }

  // Delete a task
  static async deleteTask(id: string): Promise<void> {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete task');
    }
  }

  // Get tasks with filters
  static async getTasksWithFilters(
    userId: string, 
    filters?: {
      status?: string;
      priority?: string;
      project?: string;
      search?: string;
    }
  ): Promise<Task[]> {
    const params = new URLSearchParams();
    params.append('userId', userId);
    
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    
    if (filters?.priority && filters.priority !== 'all') {
      params.append('priority', filters.priority);
    }
    
    if (filters?.project) {
      params.append('project', filters.project);
    }
    
    if (filters?.search) {
      params.append('search', filters.search);
    }

    const response = await fetch(`/api/tasks?${params.toString()}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch tasks');
    }

    return response.json();
  }

  // Update task status only (for quick status changes)
  static async updateTaskStatus(id: string, status: 'todo' | 'in-progress' | 'completed'): Promise<Task> {
    const response = await fetch(`/api/tasks/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update task status');
    }

    return response.json();
  }

  // Bulk delete tasks
  static async bulkDeleteTasks(taskIds: string[]): Promise<void> {
    const response = await fetch('/api/tasks/bulk-delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskIds }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete tasks');
    }
  }
}
