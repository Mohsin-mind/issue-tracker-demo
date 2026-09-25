import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller';
import { validate } from '../middlewares/validate.middleware';
import { commentIdParamSchema } from '../validators/comment.validator';

const router = Router();

router.delete(
  '/:commentId',
  validate(commentIdParamSchema, 'params'),
  CommentController.delete
);

export default router;
