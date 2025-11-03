/**
 * Dashboard component - displays task statistics and overview
 * Functional component with statistics display
 */

import { useState, useEffect } from 'react';
import { TaskStatistics } from '../types';
import * as api from '../services/api';

export const Dashboard = () => {
  const [stats, setStats] = useState<TaskStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getTaskStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading statistics...</div>;
  }

  if (!stats) {
    return null;
  }

  const StatCard = ({ title, value, color }: { title: string; value: number; color: string }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>{title}</div>
      <div style={{ fontSize: '32px', fontWeight: '700', color }}>{value}</div>
    </div>
  );

  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '700' }}>Dashboard</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px'
      }}>
        <StatCard title="Total Tasks" value={stats.total} color="#3b82f6" />
        <StatCard title="Pending" value={stats.pending} color="#f59e0b" />
        <StatCard title="In Progress" value={stats.inProgress} color="#8b5cf6" />
        <StatCard title="Completed" value={stats.completed} color="#10b981" />
        <StatCard title="High Priority" value={stats.highPriority} color="#ef4444" />
        <StatCard title="Overdue" value={stats.overdue} color="#dc2626" />
      </div>

      {stats.overdue > 0 && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#991b1b',
          fontSize: '14px'
        }}>
          You have {stats.overdue} overdue task{stats.overdue !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};
