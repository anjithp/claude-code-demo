/**
 * Main App component - entry point for the React application
 * Functional component with hooks for state management
 */

import { useState } from 'react';
import { TaskFilters } from './types';
import { useTasks } from './hooks/useTasks';
import { useCategories } from './hooks/useCategories';
import { Dashboard } from './components/Dashboard';
import { CategoryFilter } from './components/CategoryFilter';
import { TaskList } from './components/TaskList';

function App() {
  const [filters, setFilters] = useState<TaskFilters>({});
  const { tasks, loading, error, fetchTasks, addTask, editTask, removeTask } = useTasks();
  const { categories } = useCategories();

  const handleFilterChange = async (newFilters: TaskFilters) => {
    setFilters(newFilters);
    await fetchTasks(newFilters);
  };

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Error</h2>
          <p style={{ color: '#6b7280' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '16px',
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#3b82f6',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <header style={{ marginBottom: '32px' }}>
          <h1 style={{
            margin: 0,
            fontSize: '32px',
            fontWeight: '800',
            color: '#111827'
          }}>
            Task Management System
          </h1>
          <p style={{
            margin: '8px 0 0 0',
            fontSize: '16px',
            color: '#6b7280'
          }}>
            Organize your tasks efficiently
          </p>
        </header>

        <Dashboard />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '24px',
          alignItems: 'start'
        }}>
          <CategoryFilter
            categories={categories}
            onFilterChange={handleFilterChange}
          />

          <div>
            {loading ? (
              <div style={{
                textAlign: 'center',
                padding: '48px',
                color: '#6b7280',
                backgroundColor: 'white',
                borderRadius: '8px'
              }}>
                Loading tasks...
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                categories={categories}
                onTaskUpdate={editTask}
                onTaskDelete={removeTask}
                onTaskCreate={addTask}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
