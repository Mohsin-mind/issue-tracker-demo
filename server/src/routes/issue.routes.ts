import { Router } from 'express';
import { IssueController } from '../controllers/issue.controller';
import { CommentController } from '../controllers/comment.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createIssueSchema,
  updateIssueSchema,
  moveIssueSchema,
  issueQuerySchema,
  issueIdParamSchema,
} from '../validators/issue.validator';
import { createCommentSchema } from '../validators/comment.validator';

const router = Router();

// Issues CRUD
router.get('/', validate(issueQuerySchema, 'query'), IssueController.getAll);

router.post('/', validate(createIssueSchema, 'body'), IssueController.create);

router.get(
  '/:issueId',
  validate(issueIdParamSchema, 'params'),
  IssueController.getById
);

router.put(
  '/:issueId',
  validate(issueIdParamSchema, 'params'),
  validate(updateIssueSchema, 'body'),
  IssueController.update
);

router.delete(
  '/:issueId',
  validate(issueIdParamSchema, 'params'),
  IssueController.delete
);

// Drag & Drop Issue Move
router.patch(
  '/:issueId/move',
  validate(issueIdParamSchema, 'params'),
  validate(moveIssueSchema, 'body'),
  IssueController.move
);

// Nested Comments on Issue
router.get(
  '/:issueId/comments',
  validate(issueIdParamSchema, 'params'),
  CommentController.getByIssueId
);

router.post(
  '/:issueId/comments',
  validate(issueIdParamSchema, 'params'),
  validate(createCommentSchema, 'body'),
  CommentController.create
);

export default router;
