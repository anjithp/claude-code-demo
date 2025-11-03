/**
 * TaskCard component - displays individual task with actions
 * Functional React component
 */

import { Task, TaskStatus, TaskPriority } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: TaskStatus) => void;
}

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.HIGH:
        return '#ef4444';
      case TaskPriority.MEDIUM:
        return '#f59e0b';
      case TaskPriority.LOW:
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusBadge = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return '✓ Completed';
      case TaskStatus.IN_PROGRESS:
        return '⟳ In Progress';
      case TaskStatus.PENDING:
        return '○ Pending';
      default:
        return status;
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== TaskStatus.COMPLETED;

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{task.title}</h3>
        <span style={{
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: getPriorityColor(task.priority) + '20',
          color: getPriorityColor(task.priority)
        }}>
          {task.priority.toUpperCase()}
        </span>
      </div>

      {task.description && (
        <p style={{ margin: '8px 0', color: '#6b7280', fontSize: '14px' }}>{task.description}</p>
      )}

      <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          backgroundColor: '#f3f4f6',
          color: '#374151'
        }}>
          {getStatusBadge(task.status)}
        </span>

        {task.category && (
          <span style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            backgroundColor: task.category.color + '20',
            color: task.category.color
          }}>
            {task.category.name}
          </span>
        )}

        {task.dueDate && (
          <span style={{
            fontSize: '12px',
            color: isOverdue ? '#ef4444' : '#6b7280'
          }}>
            Due: {new Date(task.dueDate).toLocaleDateString()}
            {isOverdue && ' (Overdue)'}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        {task.status !== TaskStatus.COMPLETED && (
          <button
            onClick={() => onStatusChange(task.id,
              task.status === TaskStatus.PENDING ? TaskStatus.IN_PROGRESS : TaskStatus.COMPLETED
            )}
            style={{
              padding: '6px 12px',
              fontSize: '13px',
              borderRadius: '4px',
              border: '1px solid #3b82f6',
              backgroundColor: 'white',
              color: '#3b82f6',
              cursor: 'pointer'
            }}
          >
            {task.status === TaskStatus.PENDING ? 'Start' : 'Complete'}
          </button>
        )}

        <button
          onClick={() => onEdit(task)}
          style={{
            padding: '6px 12px',
            fontSize: '13px',
            borderRadius: '4px',
            border: '1px solid #6b7280',
            backgroundColor: 'white',
            color: '#374151',
            cursor: 'pointer'
          }}
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(task.id)}
          style={{
            padding: '6px 12px',
            fontSize: '13px',
            borderRadius: '4px',
            border: '1px solid #ef4444',
            backgroundColor: 'white',
            color: '#ef4444',
            cursor: 'pointer'
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
