/**
 * Category service layer - functional approach
 * Handles category-related business logic
 */

import { Category } from '../models';
import { CategoryCreationAttributes } from '../types';

/**
 * Retrieves all categories
 */
export const getAllCategories = async () => {
  return await Category.findAll({
    order: [['name', 'ASC']]
  });
};

/**
 * Retrieves a single category by ID
 */
export const getCategoryById = async (id: number) => {
  return await Category.findByPk(id);
};

/**
 * Creates a new category
 */
export const createCategory = async (categoryData: CategoryCreationAttributes) => {
  const validatedData = validateCategoryData(categoryData);
  return await Category.create(validatedData);
};

/**
 * Updates an existing category
 */
export const updateCategory = async (
  id: number,
  categoryData: Partial<CategoryCreationAttributes>
) => {
  const category = await Category.findByPk(id);

  if (!category) {
    return null;
  }

  const validatedData = validateCategoryData(categoryData);
  await category.update(validatedData);

  return category;
};

/**
 * Deletes a category by ID
 */
export const deleteCategory = async (id: number): Promise<boolean> => {
  const category = await Category.findByPk(id);

  if (!category) {
    return false;
  }

  await category.destroy();
  return true;
};

// Helper functions

/**
 * Validates category data (pure function)
 */
const validateCategoryData = (
  data: Partial<CategoryCreationAttributes>
): Partial<CategoryCreationAttributes> => {
  const validated: Partial<CategoryCreationAttributes> = {};

  if (data.name !== undefined) {
    const trimmedName = data.name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      throw new Error('Category name must be between 2 and 50 characters');
    }
    validated.name = trimmedName;
  }

  if (data.color !== undefined) {
    if (!isValidHexColor(data.color)) {
      throw new Error('Invalid color format. Must be a valid hex color (e.g., #FF5733)');
    }
    validated.color = data.color;
  }

  return validated;
};

/**
 * Validates hex color format (pure function)
 */
const isValidHexColor = (color: string): boolean => {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
};
