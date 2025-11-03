/**
 * CategoryFilter component - filter tasks by category, status, and priority
 * Functional component with search functionality
 */

import { useState } from 'react';
import { Category, TaskFilters, TaskStatus, TaskPriority } from '../types';
import { useDebounce } from '../hooks/useDebounce';

interface CategoryFilterProps {
  categories: Category[];
  onFilterChange: (filters: TaskFilters) => void;
}

export const CategoryFilter = ({ categories, onFilterChange }: CategoryFilterProps) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | undefined>(undefined);
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | undefined>(undefined);

  const debouncedSearch = useDebounce(search, 300);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleCategoryChange = (categoryId: number | undefined) => {
    setSelectedCategory(categoryId);
    applyFilters({ categoryId });
  };

  const handleStatusChange = (status: TaskStatus | undefined) => {
    setSelectedStatus(status);
    applyFilters({ status });
  };

  const handlePriorityChange = (priority: TaskPriority | undefined) => {
    setSelectedPriority(priority);
    applyFilters({ priority });
  };

  const applyFilters = (newFilter: Partial<TaskFilters>) => {
    onFilterChange({
      search: debouncedSearch || undefined,
      categoryId: selectedCategory,
      status: selectedStatus,
      priority: selectedPriority,
      ...newFilter
    });
  };

  const handleReset = () => {
    setSearch('');
    setSelectedCategory(undefined);
    setSelectedStatus(undefined);
    setSelectedPriority(undefined);
    onFilterChange({});
  };

  // Apply search filter when debounced value changes
  useState(() => {
    if (debouncedSearch !== search) {
      applyFilters({});
    }
  });

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Filters</h3>

      <div style={{ display: 'grid', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
            Search
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search tasks..."
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
            Category
          </label>
          <select
            value={selectedCategory || ''}
            onChange={(e) => handleCategoryChange(e.target.value ? parseInt(e.target.value) : undefined)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              fontSize: '14px'
            }}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
            Status
          </label>
          <select
            value={selectedStatus || ''}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus || undefined)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              fontSize: '14px'
            }}
          >
            <option value="">All Statuses</option>
            <option value={TaskStatus.PENDING}>Pending</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
            Priority
          </label>
          <select
            value={selectedPriority || ''}
            onChange={(e) => handlePriorityChange(e.target.value as TaskPriority || undefined)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              fontSize: '14px'
            }}
          >
            <option value="">All Priorities</option>
            <option value={TaskPriority.LOW}>Low</option>
            <option value={TaskPriority.MEDIUM}>Medium</option>
            <option value={TaskPriority.HIGH}>High</option>
          </select>
        </div>

        <button
          onClick={handleReset}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #d1d5db',
            backgroundColor: 'white',
            color: '#374151',
            fontSize: '14px',
            cursor: 'pointer',
            marginTop: '8px'
          }}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};
