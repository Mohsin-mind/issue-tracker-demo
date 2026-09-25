import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { AppError } from '../utils/app-error.util';
import { HTTP_STATUS } from '../constants/status.constants';

type RequestPart = 'body' | 'query' | 'params';

export const validate = (schema: Schema, part: RequestPart = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[part], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
      }));

      return next(
        new AppError(
          'Request validation failed',
          HTTP_STATUS.BAD_REQUEST,
          'VALIDATION_ERROR',
          details
        )
      );
    }

    // Replace request payload with sanitized, stripped values
    req[part] = value;
    next();
  };
};
