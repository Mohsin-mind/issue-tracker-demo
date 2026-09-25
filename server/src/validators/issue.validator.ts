import Joi from 'joi';
import { IssuePriority, IssueType } from '../constants/status.constants';

export const createIssueSchema = Joi.object({
  projectId: Joi.string().uuid().required().messages({
    'string.empty': 'Project ID is required',
    'string.guid': 'Invalid Project ID format',
  }),
  columnId: Joi.string().uuid().required().messages({
    'string.empty': 'Column ID is required',
    'string.guid': 'Invalid Column ID format',
  }),
  title: Joi.string().trim().min(2).max(255).required().messages({
    'string.empty': 'Issue title is required',
    'string.min': 'Issue title must be at least 2 characters',
  }),
  description: Joi.string().trim().allow('', null).optional(),
  type: Joi.string()
    .valid(...Object.values(IssueType))
    .default(IssueType.TASK)
    .optional(),
  priority: Joi.string()
    .valid(...Object.values(IssuePriority))
    .default(IssuePriority.MEDIUM),
  epicId: Joi.string().uuid().allow(null).optional(),
  assigneeId: Joi.string().uuid().allow(null).optional(),
  reporterId: Joi.string().uuid().required().messages({
    'string.empty': 'Reporter ID is required',
    'string.guid': 'Invalid Reporter ID format',
  }),
  labelIds: Joi.array().items(Joi.string().uuid()).optional(),
  dueDate: Joi.date().iso().allow(null).optional(),
});

export const updateIssueSchema = Joi.object({
  title: Joi.string().trim().min(2).max(255).optional(),
  description: Joi.string().trim().allow('', null).optional(),
  type: Joi.string().valid(...Object.values(IssueType)).optional(),
  priority: Joi.string().valid(...Object.values(IssuePriority)).optional(),
  columnId: Joi.string().uuid().optional(),
  epicId: Joi.string().uuid().allow(null).optional(),
  assigneeId: Joi.string().uuid().allow(null).optional(),
  labelIds: Joi.array().items(Joi.string().uuid()).optional(),
  dueDate: Joi.date().iso().allow(null).optional(),
  position: Joi.number().optional(),
}).min(1);

export const moveIssueSchema = Joi.object({
  targetColumnId: Joi.string().uuid().required().messages({
    'string.empty': 'Target column ID is required',
    'string.guid': 'Invalid Target Column ID format',
  }),
  newPosition: Joi.number().required().messages({
    'number.base': 'New position must be a number',
  }),
});

export const issueQuerySchema = Joi.object({
  projectId: Joi.string().uuid().optional(),
  columnId: Joi.string().uuid().optional(),
  search: Joi.string().trim().allow('').optional(),
  type: Joi.string().valid(...Object.values(IssueType)).optional(),
  priority: Joi.string().valid(...Object.values(IssuePriority)).optional(),
  assigneeId: Joi.string().uuid().allow('unassigned').optional(),
  epicId: Joi.string().uuid().allow('none').optional(),
  labelId: Joi.string().uuid().optional(),
});

export const issueIdParamSchema = Joi.object({
  issueId: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid Issue ID format (UUID expected)',
  }),
});
