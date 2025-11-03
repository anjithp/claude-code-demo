/**
 * useTasks hook - manages task state and operations
 * Custom hook for task CRUD operations
 */

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFormData, TaskFilters } from '../types';
import * as api from '../services/api';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  addTask: (taskData: TaskFormData) => Promise<void>;
  editTask: (id: number, taskData: Partial<TaskFormData>) => Promise<void>;
  removeTask: (id: number) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

export const useTasks = (initialFilters?: TaskFilters): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters | undefined>(initialFilters);

  const fetchTasks = useCallback(async (newFilters?: TaskFilters) => {
    setLoading(true);
    setError(null);

    try {
      const filterToUse = newFilters !== undefined ? newFilters : filters;
      setFilters(filterToUse);
      const data = await api.getTasks(filterToUse);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const addTask = useCallback(async (taskData: TaskFormData) => {
    setLoading(true);
    setError(null);

    try {
      await api.createTask(taskData);
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  const editTask = useCallback(async (id: number, taskData: Partial<TaskFormData>) => {
    setLoading(true);
    setError(null);

    try {
      await api.updateTask(id, taskData);
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  const removeTask = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await api.deleteTask(id);
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  const refreshTasks = useCallback(async () => {
    await fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    refreshTasks
  };
};
