import { Router } from 'express';
import { LabelController } from '../controllers/label.controller';
import { validate } from '../middlewares/validate.middleware';
import { createLabelSchema, labelQuerySchema } from '../validators/label.validator';

const router = Router();

router.get('/', validate(labelQuerySchema, 'query'), LabelController.getByProject);
router.post('/', validate(createLabelSchema, 'body'), LabelController.create);

export default router;
