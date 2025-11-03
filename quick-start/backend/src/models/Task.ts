/**
 * Task model definition using Sequelize
 * Represents individual tasks with status, priority, and relationships
 */

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { TaskAttributes, TaskCreationAttributes, TaskStatus, TaskPriority } from '../types';
import { Category } from './Category';

interface TaskInstance
  extends Model<TaskAttributes, TaskCreationAttributes>,
    TaskAttributes {}

/**
 * Defines the Task model schema
 */
export const Task = sequelize.define<TaskInstance>(
  'Task',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(...Object.values(TaskStatus)),
      allowNull: false,
      defaultValue: TaskStatus.PENDING
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(TaskPriority)),
      allowNull: false,
      defaultValue: TaskPriority.MEDIUM
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    tableName: 'tasks',
    timestamps: true
  }
);

/**
 * Establishes model associations
 */
export const setupAssociations = (): void => {
  Task.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
  });

  Category.hasMany(Task, {
    foreignKey: 'categoryId',
    as: 'tasks'
  });
};
