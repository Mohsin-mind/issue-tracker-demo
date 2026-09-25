import Joi from 'joi';
import { EpicStatus } from '../constants/status.constants';

export const createEpicSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Epic name is required',
    'string.min': 'Epic name must be at least 2 characters',
    'string.max': 'Epic name cannot exceed 100 characters',
  }),
  description: Joi.string().trim().max(1000).allow('', null).optional(),
  color: Joi.string()
    .trim()
    .pattern(/^#[0-9a-fA-F]{6}$/)
    .default('#8b5cf6')
    .messages({
      'string.pattern.base': 'Color must be a valid 6-character hex code (e.g. #8b5cf6)',
    }),
  status: Joi.string()
    .valid(...Object.values(EpicStatus))
    .default(EpicStatus.TODO),
});

export const updateEpicSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  description: Joi.string().trim().max(1000).allow('', null).optional(),
  color: Joi.string()
    .trim()
    .pattern(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  status: Joi.string().valid(...Object.values(EpicStatus)).optional(),
}).min(1);

export const epicIdParamSchema = Joi.object({
  epicId: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid Epic ID format (UUID expected)',
  }),
});
