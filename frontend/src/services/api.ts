import { Task } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching for dynamic data fetching
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch tasks');
    }
    
    const json = await res.json();
    return json.data;
  },

  async createTask(taskData: { title: string; description?: string }): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const err = new Error(errorData.message || 'Failed to create task') as any;
      err.errors = errorData.errors;
      throw err;
    }
    
    const json = await res.json();
    return json.data;
  },

  async updateTask(id: string, taskData: { title?: string; description?: string; completed?: boolean }): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const err = new Error(errorData.message || 'Failed to update task') as any;
      err.errors = errorData.errors;
      throw err;
    }
    
    const json = await res.json();
    return json.data;
  },

  async deleteTask(id: string): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete task');
    }
    
    const json = await res.json();
    return json.data;
  },
};
