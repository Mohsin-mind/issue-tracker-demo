import { Router, Request, Response } from 'express';
import { ApiResponse } from '../helpers/api-response.helper';
import { API_MESSAGES } from '../constants/messages.constants';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  return ApiResponse.success(res, {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }, API_MESSAGES.HEALTH_OK);
});

export default router;
