/**
 * Task service unit tests
 * Tests for task business logic functions
 */

import { Task, Category } from '../../src/models';
import * as taskService from '../../src/services/taskService';
import { TaskStatus, TaskPriority } from '../../src/types';
import { sequelize } from '../../src/config/database';

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create test category
  await Category.create({
    name: 'Test Category',
    color: '#3b82f6'
  });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await Task.destroy({ where: {} });
});

describe('Task Service', () => {
  describe('createTask', () => {
    it('should create a task with valid data', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test description',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM
      };

      const task = await taskService.createTask(taskData);

      expect(task).toBeDefined();
      expect(task.title).toBe(taskData.title);
      expect(task.description).toBe(taskData.description);
      expect(task.status).toBe(taskData.status);
      expect(task.priority).toBe(taskData.priority);
    });

    it('should throw error for invalid title', async () => {
      const taskData = {
        title: 'ab', // Too short
        description: 'Test'
      };

      await expect(taskService.createTask(taskData)).rejects.toThrow();
    });
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      await Task.create({
        title: 'Task 1',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW
      });

      await Task.create({
        title: 'Task 2',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH
      });

      const tasks = await taskService.getAllTasks();
      expect(tasks).toHaveLength(2);
    });

    it('should filter tasks by status', async () => {
      await Task.create({
        title: 'Pending Task',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW
      });

      await Task.create({
        title: 'Completed Task',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH
      });

      const pendingTasks = await taskService.getAllTasks({ status: TaskStatus.PENDING });
      expect(pendingTasks).toHaveLength(1);
      expect(pendingTasks[0].title).toBe('Pending Task');
    });

    it('should filter tasks by priority', async () => {
      await Task.create({
        title: 'High Priority',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH
      });

      await Task.create({
        title: 'Low Priority',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW
      });

      const highPriorityTasks = await taskService.getAllTasks({ priority: TaskPriority.HIGH });
      expect(highPriorityTasks).toHaveLength(1);
      expect(highPriorityTasks[0].title).toBe('High Priority');
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      const created = await Task.create({
        title: 'Test Task',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM
      });

      const task = await taskService.getTaskById(created.id);
      expect(task).toBeDefined();
      expect(task?.title).toBe('Test Task');
    });

    it('should return null for non-existent task', async () => {
      const task = await taskService.getTaskById(9999);
      expect(task).toBeNull();
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const created = await Task.create({
        title: 'Original Title',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW
      });

      const updated = await taskService.updateTask(created.id, {
        title: 'Updated Title',
        status: TaskStatus.COMPLETED
      });

      expect(updated).toBeDefined();
      expect(updated?.title).toBe('Updated Title');
      expect(updated?.status).toBe(TaskStatus.COMPLETED);
    });

    it('should return null for non-existent task', async () => {
      const result = await taskService.updateTask(9999, { title: 'Test' });
      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const created = await Task.create({
        title: 'Task to Delete',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW
      });

      const deleted = await taskService.deleteTask(created.id);
      expect(deleted).toBe(true);

      const task = await taskService.getTaskById(created.id);
      expect(task).toBeNull();
    });

    it('should return false for non-existent task', async () => {
      const deleted = await taskService.deleteTask(9999);
      expect(deleted).toBe(false);
    });
  });

  describe('getTaskStatistics', () => {
    it('should return correct statistics', async () => {
      await Task.create({
        title: 'Pending Task',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH
      });

      await Task.create({
        title: 'In Progress Task',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM
      });

      await Task.create({
        title: 'Completed Task',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.LOW
      });

      const stats = await taskService.getTaskStatistics();

      expect(stats.total).toBe(3);
      expect(stats.pending).toBe(1);
      expect(stats.inProgress).toBe(1);
      expect(stats.completed).toBe(1);
      expect(stats.highPriority).toBe(1);
    });

    it('should count overdue tasks correctly', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);

      await Task.create({
        title: 'Overdue Task',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        dueDate: pastDate
      });

      const stats = await taskService.getTaskStatistics();
      expect(stats.overdue).toBe(1);
    });
  });
});
