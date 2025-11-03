/**
 * useCategories hook - manages category state and operations
 * Custom hook for category CRUD operations
 */

import { useState, useEffect, useCallback } from 'react';
import { Category, CategoryFormData } from '../types';
import * as api from '../services/api';

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (categoryData: CategoryFormData) => Promise<void>;
  editCategory: (id: number, categoryData: Partial<CategoryFormData>) => Promise<void>;
  removeCategory: (id: number) => Promise<void>;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = useCallback(async (categoryData: CategoryFormData) => {
    setLoading(true);
    setError(null);

    try {
      await api.createCategory(categoryData);
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const editCategory = useCallback(async (id: number, categoryData: Partial<CategoryFormData>) => {
    setLoading(true);
    setError(null);

    try {
      await api.updateCategory(id, categoryData);
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const removeCategory = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await api.deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory
  };
};
