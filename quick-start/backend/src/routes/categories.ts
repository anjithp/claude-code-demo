/**
 * Category routes configuration
 * RESTful API endpoints for category management
 */

import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';
import { asyncHandler } from '../middleware/errorHandler';
import { validateRequiredFields, validateIdParam } from '../middleware/validation';

const router = Router();

// GET /api/categories - Get all categories
router.get('/', asyncHandler(categoryController.getCategories));

// GET /api/categories/:id - Get single category
router.get('/:id', validateIdParam, asyncHandler(categoryController.getCategory));

// POST /api/categories - Create new category
router.post(
  '/',
  validateRequiredFields(['name']),
  asyncHandler(categoryController.createCategory)
);

// PUT /api/categories/:id - Update category
router.put('/:id', validateIdParam, asyncHandler(categoryController.updateCategory));

// DELETE /api/categories/:id - Delete category
router.delete('/:id', validateIdParam, asyncHandler(categoryController.deleteCategory));

export default router;
