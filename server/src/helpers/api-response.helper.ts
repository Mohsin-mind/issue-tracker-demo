import { Response } from 'express';
import { HTTP_STATUS } from '../constants/status.constants';

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = HTTP_STATUS.OK
  ): Response {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
    });
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
  ): Response {
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data,
      message,
    });
  }

  static noContent(res: Response): Response {
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  }

  static error(
    res: Response,
    message: string = 'An error occurred',
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: string = 'INTERNAL_ERROR',
    details?: unknown
  ): Response {
    return res.status(statusCode).json({
      success: false,
      error: {
        message,
        code,
        details,
      },
    });
  }
}
