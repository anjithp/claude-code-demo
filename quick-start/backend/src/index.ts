/**
 * Main application entry point
 * Express server setup with middleware and routes
 */

import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, sequelize } from './config/database';
import { seedCategories } from './models';
import taskRoutes from './routes/tasks';
import categoryRoutes from './routes/categories';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;
const app: Application = express();

/**
 * Configures Express middleware
 */
const setupMiddleware = (app: Application): void => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

/**
 * Configures API routes
 */
const setupRoutes = (app: Application): void => {
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/tasks', taskRoutes);
  app.use('/api/categories', categoryRoutes);

  // Error handlers (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);
};

/**
 * Starts the Express server
 */
const startServer = async (): Promise<void> => {
  try {
    // Initialize database
    await initializeDatabase(sequelize);

    // Seed default categories
    await seedCategories();
    console.log('✓ Default categories seeded');

    // Setup middleware and routes
    setupMiddleware(app);
    setupRoutes(app);

    // Start server
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
      console.log(`✓ API endpoints: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

/**
 * Graceful shutdown handler
 */
const setupGracefulShutdown = (): void => {
  process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await sequelize.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\nShutting down gracefully...');
    await sequelize.close();
    process.exit(0);
  });
};

// Start application
setupGracefulShutdown();
startServer();

export default app;
