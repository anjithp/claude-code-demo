/**
 * Task routes configuration
 * RESTful API endpoints for task management
 */

import { Router } from 'express';
import * as taskController from '../controllers/taskController';
import { asyncHandler } from '../middleware/errorHandler';
import { validateRequiredFields, validateIdParam } from '../middleware/validation';

const router = Router();

// GET /api/tasks/stats - Must be before /:id route
router.get('/stats', asyncHandler(taskController.getTaskStats));

// GET /api/tasks - Get all tasks with optional filters
router.get('/', asyncHandler(taskController.getTasks));

// GET /api/tasks/:id - Get single task
router.get('/:id', validateIdParam, asyncHandler(taskController.getTask));

// POST /api/tasks - Create new task
router.post(
  '/',
  validateRequiredFields(['title']),
  asyncHandler(taskController.createTask)
);

// PUT /api/tasks/:id - Update task
router.put('/:id', validateIdParam, asyncHandler(taskController.updateTask));

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', validateIdParam, asyncHandler(taskController.deleteTask));

export default router;
