/**
 * Task service layer - functional approach to business logic
 * Pure functions for task operations and data transformations
 */

import { Task, Category } from '../models';
import { TaskCreationAttributes, TaskFilters, TaskStatus, TaskPriority } from '../types';
import { Op } from 'sequelize';

/**
 * Retrieves all tasks with optional filtering
 */
export const getAllTasks = async (filters: TaskFilters = {}) => {
  const whereClause = buildWhereClause(filters);

  return await Task.findAll({
    where: whereClause,
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'color']
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

/**
 * Retrieves a single task by ID
 */
export const getTaskById = async (id: number) => {
  return await Task.findByPk(id, {
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'color']
      }
    ]
  });
};

/**
 * Creates a new task
 */
export const createTask = async (taskData: TaskCreationAttributes) => {
  const validatedData = validateTaskData(taskData);
  return await Task.create(validatedData);
};

/**
 * Updates an existing task
 */
export const updateTask = async (id: number, taskData: Partial<TaskCreationAttributes>) => {
  const task = await Task.findByPk(id);

  if (!task) {
    return null;
  }

  const validatedData = validateTaskData(taskData);
  await task.update(validatedData);

  return await getTaskById(id);
};

/**
 * Deletes a task by ID
 */
export const deleteTask = async (id: number): Promise<boolean> => {
  const task = await Task.findByPk(id);

  if (!task) {
    return false;
  }

  await task.destroy();
  return true;
};

/**
 * Gets task statistics
 */
export const getTaskStatistics = async () => {
  const tasks = await Task.findAll();

  return {
    total: tasks.length,
    pending: countByStatus(tasks, TaskStatus.PENDING),
    inProgress: countByStatus(tasks, TaskStatus.IN_PROGRESS),
    completed: countByStatus(tasks, TaskStatus.COMPLETED),
    highPriority: countByPriority(tasks, TaskPriority.HIGH),
    overdue: countOverdueTasks(tasks)
  };
};

// Helper functions (pure functions for data transformation)

/**
 * Builds Sequelize where clause from filters
 */
const buildWhereClause = (filters: TaskFilters): any => {
  const where: any = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${filters.search}%` } },
      { description: { [Op.like]: `%${filters.search}%` } }
    ];
  }

  return where;
};

/**
 * Validates task data before creation/update
 */
const validateTaskData = (data: Partial<TaskCreationAttributes>): Partial<TaskCreationAttributes> => {
  const validated: Partial<TaskCreationAttributes> = {};

  if (data.title !== undefined) {
    if (data.title.trim().length < 3) {
      throw new Error('Title must be at least 3 characters long');
    }
    validated.title = data.title.trim();
  }

  if (data.description !== undefined) {
    validated.description = data.description.trim();
  }

  if (data.status !== undefined) {
    if (!Object.values(TaskStatus).includes(data.status)) {
      throw new Error('Invalid task status');
    }
    validated.status = data.status;
  }

  if (data.priority !== undefined) {
    if (!Object.values(TaskPriority).includes(data.priority)) {
      throw new Error('Invalid task priority');
    }
    validated.priority = data.priority;
  }

  if (data.dueDate !== undefined) {
    validated.dueDate = data.dueDate;
  }

  if (data.categoryId !== undefined) {
    validated.categoryId = data.categoryId;
  }

  return validated;
};

/**
 * Counts tasks by status (pure function)
 */
const countByStatus = (tasks: any[], status: TaskStatus): number => {
  return tasks.filter(task => task.status === status).length;
};

/**
 * Counts tasks by priority (pure function)
 */
const countByPriority = (tasks: any[], priority: TaskPriority): number => {
  return tasks.filter(task => task.priority === priority).length;
};

/**
 * Counts overdue tasks (pure function)
 */
const countOverdueTasks = (tasks: any[]): number => {
  const now = new Date();
  return tasks.filter(
    task =>
      task.dueDate &&
      new Date(task.dueDate) < now &&
      task.status !== TaskStatus.COMPLETED
  ).length;
};
