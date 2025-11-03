/**
 * Database configuration and initialization using Sequelize ORM
 * Functional approach to database setup
 */

import { Sequelize } from 'sequelize';
import path from 'path';

const env = process.env.NODE_ENV || 'development';
const dbStorage = process.env.DB_STORAGE || path.join(__dirname, '../../database.sqlite');

/**
 * Creates and configures a Sequelize instance
 */
export const createSequelizeInstance = (): Sequelize => {
  return new Sequelize({
    dialect: 'sqlite',
    storage: dbStorage,
    logging: env === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: false
    }
  });
};

/**
 * Initializes database connection and syncs models
 */
export const initializeDatabase = async (sequelize: Sequelize): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');

    // Sync models with database (use { force: true } to drop tables)
    await sequelize.sync({ alter: env === 'development' });
    console.log('✓ Database models synchronized');
  } catch (error) {
    console.error('✗ Unable to connect to database:', error);
    throw error;
  }
};

/**
 * Closes database connection gracefully
 */
export const closeDatabase = async (sequelize: Sequelize): Promise<void> => {
  try {
    await sequelize.close();
    console.log('✓ Database connection closed');
  } catch (error) {
    console.error('✗ Error closing database:', error);
    throw error;
  }
};

// Export singleton instance
export const sequelize = createSequelizeInstance();
