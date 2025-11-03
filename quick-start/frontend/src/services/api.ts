/**
 * API service layer - handles all HTTP requests to the backend
 * Functional approach with async functions
 */

import {
  Task,
  Category,
  TaskFormData,
  CategoryFormData,
  TaskFilters,
  TaskStatistics,
  ApiResponse
} from '../types';

const API_BASE_URL = '/api';

/**
 * Generic fetch wrapper with error handling
 */
const fetchApi = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      ...options
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Task API functions

/**
 * Fetches all tasks with optional filters
 */
export const getTasks = async (filters?: TaskFilters): Promise<Task[]> => {
  const params = new URLSearchParams();

  if (filters?.status) params.append('status', filters.status);
  if (filters?.priority) params.append('priority', filters.priority);
  if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
  if (filters?.search) params.append('search', filters.search);

  const queryString = params.toString();
  const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`;

  const response = await fetchApi<Task[]>(endpoint);
  return response.data || [];
};

/**
 * Fetches a single task by ID
 */
export const getTask = async (id: number): Promise<Task> => {
  const response = await fetchApi<Task>(`/tasks/${id}`);
  if (!response.data) {
    throw new Error('Task not found');
  }
  return response.data;
};

/**
 * Creates a new task
 */
export const createTask = async (taskData: TaskFormData): Promise<Task> => {
  const response = await fetchApi<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData)
  });

  if (!response.data) {
    throw new Error('Failed to create task');
  }

  return response.data;
};

/**
 * Updates an existing task
 */
export const updateTask = async (id: number, taskData: Partial<TaskFormData>): Promise<Task> => {
  const response = await fetchApi<Task>(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData)
  });

  if (!response.data) {
    throw new Error('Failed to update task');
  }

  return response.data;
};

/**
 * Deletes a task
 */
export const deleteTask = async (id: number): Promise<void> => {
  await fetchApi(`/tasks/${id}`, {
    method: 'DELETE'
  });
};

/**
 * Fetches task statistics
 */
export const getTaskStats = async (): Promise<TaskStatistics> => {
  const response = await fetchApi<TaskStatistics>('/tasks/stats');
  if (!response.data) {
    throw new Error('Failed to fetch statistics');
  }
  return response.data;
};

// Category API functions

/**
 * Fetches all categories
 */
export const getCategories = async (): Promise<Category[]> => {
  const response = await fetchApi<Category[]>('/categories');
  return response.data || [];
};

/**
 * Fetches a single category by ID
 */
export const getCategory = async (id: number): Promise<Category> => {
  const response = await fetchApi<Category>(`/categories/${id}`);
  if (!response.data) {
    throw new Error('Category not found');
  }
  return response.data;
};

/**
 * Creates a new category
 */
export const createCategory = async (categoryData: CategoryFormData): Promise<Category> => {
  const response = await fetchApi<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData)
  });

  if (!response.data) {
    throw new Error('Failed to create category');
  }

  return response.data;
};

/**
 * Updates an existing category
 */
export const updateCategory = async (
  id: number,
  categoryData: Partial<CategoryFormData>
): Promise<Category> => {
  const response = await fetchApi<Category>(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData)
  });

  if (!response.data) {
    throw new Error('Failed to update category');
  }

  return response.data;
};

/**
 * Deletes a category
 */
export const deleteCategory = async (id: number): Promise<void> => {
  await fetchApi(`/categories/${id}`, {
    method: 'DELETE'
  });
};
