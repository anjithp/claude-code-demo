/**
 * Request validation middleware
 * Functional validation helpers
 */

import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';

/**
 * Validates required fields in request body
 */
export const validateRequiredFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missingFields = fields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      throw new ApiError(
        400,
        `Missing required fields: ${missingFields.join(', ')}`
      );
    }

    next();
  };
};

/**
 * Validates numeric ID parameter
 */
export const validateIdParam = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    throw new ApiError(400, 'Invalid ID parameter');
  }

  next();
};

/**
 * Sanitizes string input (pure function)
 */
export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
