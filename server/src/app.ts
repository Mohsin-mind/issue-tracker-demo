import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config';
import apiRoutes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { AppError } from './utils/app-error.util';
import { HTTP_STATUS } from './constants/status.constants';

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Handshake Route
app.get('/', (_req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Mini Jira/Trello Issue Tracker API Handshake Successful',
    data: {
      name: 'Issue Tracker API',
      version: '1.0.0',
      status: 'UP',
      clientUrl: config.clientUrl,
      endpoints: {
        health: '/api/health',
        projects: '/api/projects',
        issues: '/api/issues',
        users: '/api/users',
        epics: '/api/epics',
      },
    },
  });
});

// API Routes
app.use('/api', apiRoutes);

// Catch 404 for unhandled routes
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('API endpoint not found', HTTP_STATUS.NOT_FOUND, 'NOT_FOUND'));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
