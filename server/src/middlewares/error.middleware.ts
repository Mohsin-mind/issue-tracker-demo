import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error.util';
import { ApiResponse } from '../helpers/api-response.helper';
import { HTTP_STATUS } from '../constants/status.constants';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  // Operational AppError
  if (err instanceof AppError) {
    return ApiResponse.error(
      res,
      err.message,
      err.statusCode,
      err.code,
      err.details
    );
  }

  // Sequelize Unique Constraint Error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return ApiResponse.error(
      res,
      'A record with this unique identifier already exists',
      HTTP_STATUS.CONFLICT,
      'UNIQUE_CONSTRAINT_ERROR'
    );
  }

  // Sequelize Foreign Key Constraint Error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return ApiResponse.error(
      res,
      'Invalid foreign key reference or related records exist',
      HTTP_STATUS.BAD_REQUEST,
      'FOREIGN_KEY_ERROR'
    );
  }

  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    return ApiResponse.error(
      res,
      err.message,
      HTTP_STATUS.BAD_REQUEST,
      'DATABASE_VALIDATION_ERROR'
    );
  }

  // Unhandled / Internal Server Error
  console.error('[UNHANDLED_ERROR]:', err);
  return ApiResponse.error(
    res,
    process.env.NODE_ENV === 'production'
      ? 'An unexpected internal server error occurred'
      : err.message,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    'INTERNAL_SERVER_ERROR'
  );
};
