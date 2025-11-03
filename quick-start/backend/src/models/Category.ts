/**
 * Category model definition using Sequelize
 * Represents task categories with associated colors
 */

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { CategoryAttributes, CategoryCreationAttributes } from '../types';

interface CategoryInstance
  extends Model<CategoryAttributes, CategoryCreationAttributes>,
    CategoryAttributes {}

/**
 * Defines the Category model schema
 */
export const Category = sequelize.define<CategoryInstance>(
  'Category',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '#6366f1',
      validate: {
        is: /^#[0-9A-Fa-f]{6}$/
      }
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
    tableName: 'categories',
    timestamps: true
  }
);

/**
 * Seeds default categories into the database
 */
export const seedCategories = async (): Promise<void> => {
  const defaultCategories = [
    { name: 'Work', color: '#3b82f6' },
    { name: 'Personal', color: '#10b981' },
    { name: 'Shopping', color: '#f59e0b' },
    { name: 'Health', color: '#ef4444' }
  ];

  for (const category of defaultCategories) {
    await Category.findOrCreate({
      where: { name: category.name },
      defaults: category
    });
  }
};
