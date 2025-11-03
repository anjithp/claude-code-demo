/**
 * Error handling middleware
 * Functional approach to error processing and response formatting
 */

import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  if (err instanceof ApiError) {
    const response: ApiResponse<null> = {
      success: false,
      error: err.message
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Validation error',
      message: err.message
    };
    res.status(400).json(response);
    return;
  }

  // Default error response
  const response: ApiResponse<null> = {
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  };

  res.status(500).json(response);
};

/**
 * Async handler wrapper to catch promise rejections
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse<null> = {
    success: false,
    error: 'Route not found'
  };
  res.status(404).json(response);
};
