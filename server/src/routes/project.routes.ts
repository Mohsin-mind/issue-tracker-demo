import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createProjectSchema,
  updateProjectSchema,
  projectIdParamSchema,
} from '../validators/project.validator';

const router = Router();

router.get('/', ProjectController.getAll);

router.post(
  '/',
  validate(createProjectSchema, 'body'),
  ProjectController.create
);

router.get(
  '/:projectId',
  validate(projectIdParamSchema, 'params'),
  ProjectController.getById
);

router.put(
  '/:projectId',
  validate(projectIdParamSchema, 'params'),
  validate(updateProjectSchema, 'body'),
  ProjectController.update
);

router.delete(
  '/:projectId',
  validate(projectIdParamSchema, 'params'),
  ProjectController.delete
);

router.get(
  '/:projectId/board',
  validate(projectIdParamSchema, 'params'),
  ProjectController.getBoard
);

router.get(
  '/:projectId/statistics',
  validate(projectIdParamSchema, 'params'),
  ProjectController.getStatistics
);

export default router;
