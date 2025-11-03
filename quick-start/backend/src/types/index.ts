/**
 * Core type definitions for the Task Management API
 */

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface TaskAttributes {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  categoryId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskCreationAttributes {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  categoryId?: number;
}

export interface CategoryAttributes {
  id: number;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryCreationAttributes {
  name: string;
  color?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  categoryId?: number;
  search?: string;
}
