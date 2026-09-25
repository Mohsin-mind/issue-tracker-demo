import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { EpicController } from '../controllers/epic.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createProjectSchema,
  updateProjectSchema,
  projectIdParamSchema,
} from '../validators/project.validator';
import { createEpicSchema } from '../validators/epic.validator';

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

router.get(
  '/:projectId/epics',
  validate(projectIdParamSchema, 'params'),
  EpicController.getByProject
);

router.post(
  '/:projectId/epics',
  validate(projectIdParamSchema, 'params'),
  validate(createEpicSchema, 'body'),
  EpicController.create
);

export default router;
