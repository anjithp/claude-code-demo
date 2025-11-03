/**
 * TaskForm component - form for creating and editing tasks
 * Functional component with useForm hook
 */

import { useEffect } from 'react';
import { Task, TaskFormData, TaskStatus, TaskPriority, Category } from '../types';
import { useForm } from '../hooks/useForm';

interface TaskFormProps {
  task?: Task;
  categories: Category[];
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
}

const validateTask = (values: TaskFormData): Partial<Record<keyof TaskFormData, string>> => {
  const errors: Partial<Record<keyof TaskFormData, string>> = {};

  if (!values.title || values.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  return errors;
};

export const TaskForm = ({ task, categories, onSubmit, onCancel }: TaskFormProps) => {
  const initialValues: TaskFormData = {
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || TaskStatus.PENDING,
    priority: task?.priority || TaskPriority.MEDIUM,
    dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
    categoryId: task?.categoryId || undefined
  };

  const { values, errors, handleChange, handleSubmit, setValues } = useForm<TaskFormData>(
    initialValues,
    validateTask
  );

  useEffect(() => {
    if (task) {
      setValues(initialValues);
    }
  }, [task]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2 style={{ margin: '0 0 20px 0' }}>{task ? 'Edit Task' : 'Create New Task'}</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
              Title *
            </label>
            <input
              type="text"
              value={values.title}
              onChange={(e) => handleChange('title', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                fontSize: '14px'
              }}
            />
            {errors.title && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.title}</span>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
              Description
            </label>
            <textarea
              value={values.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                Status
              </label>
              <select
                value={values.status}
                onChange={(e) => handleChange('status', e.target.value as TaskStatus)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px'
                }}
              >
                <option value={TaskStatus.PENDING}>Pending</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.COMPLETED}>Completed</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                Priority
              </label>
              <select
                value={values.priority}
                onChange={(e) => handleChange('priority', e.target.value as TaskPriority)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px'
                }}
              >
                <option value={TaskPriority.LOW}>Low</option>
                <option value={TaskPriority.MEDIUM}>Medium</option>
                <option value={TaskPriority.HIGH}>High</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                Category
              </label>
              <select
                value={values.categoryId || ''}
                onChange={(e) => handleChange('categoryId', e.target.value ? parseInt(e.target.value) : undefined)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px'
                }}
              >
                <option value="">None</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                Due Date
              </label>
              <input
                type="date"
                value={values.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '10px 20px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                color: '#374151',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#3b82f6',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              {task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
