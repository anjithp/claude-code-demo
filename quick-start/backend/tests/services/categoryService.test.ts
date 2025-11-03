/**
 * Category service unit tests
 * Tests for category business logic functions
 */

import { Category } from '../../src/models';
import * as categoryService from '../../src/services/categoryService';
import { sequelize } from '../../src/config/database';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await Category.destroy({ where: {} });
});

describe('Category Service', () => {
  describe('createCategory', () => {
    it('should create a category with valid data', async () => {
      const categoryData = {
        name: 'Work',
        color: '#3b82f6'
      };

      const category = await categoryService.createCategory(categoryData);

      expect(category).toBeDefined();
      expect(category.name).toBe(categoryData.name);
      expect(category.color).toBe(categoryData.color);
    });

    it('should use default color if not provided', async () => {
      const category = await categoryService.createCategory({ name: 'Personal' });
      expect(category.color).toBeDefined();
    });

    it('should throw error for invalid color format', async () => {
      const categoryData = {
        name: 'Invalid',
        color: 'not-a-color'
      };

      await expect(categoryService.createCategory(categoryData)).rejects.toThrow();
    });

    it('should throw error for short name', async () => {
      const categoryData = {
        name: 'A',
        color: '#ff0000'
      };

      await expect(categoryService.createCategory(categoryData)).rejects.toThrow();
    });
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      await Category.create({ name: 'Work', color: '#3b82f6' });
      await Category.create({ name: 'Personal', color: '#10b981' });

      const categories = await categoryService.getAllCategories();
      expect(categories).toHaveLength(2);
    });

    it('should return empty array when no categories exist', async () => {
      const categories = await categoryService.getAllCategories();
      expect(categories).toHaveLength(0);
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by id', async () => {
      const created = await Category.create({ name: 'Work', color: '#3b82f6' });
      const category = await categoryService.getCategoryById(created.id);

      expect(category).toBeDefined();
      expect(category?.name).toBe('Work');
    });

    it('should return null for non-existent category', async () => {
      const category = await categoryService.getCategoryById(9999);
      expect(category).toBeNull();
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const created = await Category.create({ name: 'Old Name', color: '#3b82f6' });

      const updated = await categoryService.updateCategory(created.id, {
        name: 'New Name',
        color: '#10b981'
      });

      expect(updated).toBeDefined();
      expect(updated?.name).toBe('New Name');
      expect(updated?.color).toBe('#10b981');
    });

    it('should return null for non-existent category', async () => {
      const result = await categoryService.updateCategory(9999, { name: 'Test' });
      expect(result).toBeNull();
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const created = await Category.create({ name: 'To Delete', color: '#3b82f6' });

      const deleted = await categoryService.deleteCategory(created.id);
      expect(deleted).toBe(true);

      const category = await categoryService.getCategoryById(created.id);
      expect(category).toBeNull();
    });

    it('should return false for non-existent category', async () => {
      const deleted = await categoryService.deleteCategory(9999);
      expect(deleted).toBe(false);
    });
  });
});
