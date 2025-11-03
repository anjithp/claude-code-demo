/**
 * Category controller - handles HTTP requests for category operations
 */

import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';
import { ApiResponse } from '../types';
import { ApiError } from '../middleware/errorHandler';

/**
 * GET /api/categories - Retrieves all categories
 */
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  const categories = await categoryService.getAllCategories();

  const response: ApiResponse<typeof categories> = {
    success: true,
    data: categories
  };

  res.json(response);
};

/**
 * GET /api/categories/:id - Retrieves a single category
 */
export const getCategory = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const category = await categoryService.getCategoryById(id);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  const response: ApiResponse<typeof category> = {
    success: true,
    data: category
  };

  res.json(response);
};

/**
 * POST /api/categories - Creates a new category
 */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const category = await categoryService.createCategory(req.body);

  const response: ApiResponse<typeof category> = {
    success: true,
    data: category,
    message: 'Category created successfully'
  };

  res.status(201).json(response);
};

/**
 * PUT /api/categories/:id - Updates an existing category
 */
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const category = await categoryService.updateCategory(id, req.body);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  const response: ApiResponse<typeof category> = {
    success: true,
    data: category,
    message: 'Category updated successfully'
  };

  res.json(response);
};

/**
 * DELETE /api/categories/:id - Deletes a category
 */
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const deleted = await categoryService.deleteCategory(id);

  if (!deleted) {
    throw new ApiError(404, 'Category not found');
  }

  const response: ApiResponse<null> = {
    success: true,
    message: 'Category deleted successfully'
  };

  res.json(response);
};
