/**
 * TaskList component - displays list of tasks with filtering
 * Functional component using custom hooks
 */

import { useState } from 'react';
import { Task, TaskFormData, TaskStatus, Category } from '../types';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  onTaskUpdate: (id: number, data: Partial<TaskFormData>) => Promise<void>;
  onTaskDelete: (id: number) => Promise<void>;
  onTaskCreate: (data: TaskFormData) => Promise<void>;
}

export const TaskList = ({
  tasks,
  categories,
  onTaskUpdate,
  onTaskDelete,
  onTaskCreate
}: TaskListProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingTask(undefined);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: TaskFormData) => {
    if (editingTask) {
      await onTaskUpdate(editingTask.id, data);
    } else {
      await onTaskCreate(data);
    }
    setShowForm(false);
    setEditingTask(undefined);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTask(undefined);
  };

  const handleStatusChange = async (id: number, status: TaskStatus) => {
    await onTaskUpdate(id, { status });
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>Tasks</h2>
        <button
          onClick={handleCreate}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          + New Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px',
          color: '#6b7280',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '2px dashed #e5e7eb'
        }}>
          <p style={{ fontSize: '16px', margin: 0 }}>No tasks found</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>Create your first task to get started</p>
        </div>
      ) : (
        <div>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={onTaskDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {showForm && (
        <TaskForm
          task={editingTask}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};
