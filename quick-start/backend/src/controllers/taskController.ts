/**
 * Task controller - handles HTTP requests for task operations
 * Functional approach with pure request handlers
 */

import { Request, Response } from 'express';
import * as taskService from '../services/taskService';
import { ApiResponse, TaskFilters } from '../types';
import { ApiError } from '../middleware/errorHandler';

/**
 * GET /api/tasks - Retrieves all tasks with optional filters
 */
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const filters: TaskFilters = {
    status: req.query.status as any,
    priority: req.query.priority as any,
    categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
    search: req.query.search as string
  };

  const tasks = await taskService.getAllTasks(filters);

  const response: ApiResponse<typeof tasks> = {
    success: true,
    data: tasks
  };

  res.json(response);
};

/**
 * GET /api/tasks/:id - Retrieves a single task
 */
export const getTask = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const task = await taskService.getTaskById(id);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  const response: ApiResponse<typeof task> = {
    success: true,
    data: task
  };

  res.json(response);
};

/**
 * POST /api/tasks - Creates a new task
 */
export const createTask = async (req: Request, res: Response): Promise<void> => {
  const task = await taskService.createTask(req.body);

  const response: ApiResponse<typeof task> = {
    success: true,
    data: task,
    message: 'Task created successfully'
  };

  res.status(201).json(response);
};

/**
 * PUT /api/tasks/:id - Updates an existing task
 */
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const task = await taskService.updateTask(id, req.body);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  const response: ApiResponse<typeof task> = {
    success: true,
    data: task,
    message: 'Task updated successfully'
  };

  res.json(response);
};

/**
 * DELETE /api/tasks/:id - Deletes a task
 */
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const deleted = await taskService.deleteTask(id);

  if (!deleted) {
    throw new ApiError(404, 'Task not found');
  }

  const response: ApiResponse<null> = {
    success: true,
    message: 'Task deleted successfully'
  };

  res.json(response);
};

/**
 * GET /api/tasks/stats - Gets task statistics
 */
export const getTaskStats = async (req: Request, res: Response): Promise<void> => {
  const stats = await taskService.getTaskStatistics();

  const response: ApiResponse<typeof stats> = {
    success: true,
    data: stats
  };

  res.json(response);
};
