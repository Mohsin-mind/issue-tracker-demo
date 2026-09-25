import { Router } from 'express';
import { EpicController } from '../controllers/epic.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  updateEpicSchema,
  epicIdParamSchema,
} from '../validators/epic.validator';

const router = Router();

router.get(
  '/:epicId',
  validate(epicIdParamSchema, 'params'),
  EpicController.getById
);

router.put(
  '/:epicId',
  validate(epicIdParamSchema, 'params'),
  validate(updateEpicSchema, 'body'),
  EpicController.update
);

router.delete(
  '/:epicId',
  validate(epicIdParamSchema, 'params'),
  EpicController.delete
);

export default router;
