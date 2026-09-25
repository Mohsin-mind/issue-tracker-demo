import Joi from 'joi';

export const createProjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required().messages({
    'string.empty': 'Project name is required',
    'string.min': 'Project name must be at least 2 characters',
    'string.max': 'Project name cannot exceed 150 characters',
  }),
  key: Joi.string()
    .trim()
    .uppercase()
    .min(2)
    .max(10)
    .pattern(/^[A-Z0-9]+$/)
    .required()
    .messages({
      'string.empty': 'Project key is required',
      'string.pattern.base': 'Project key must contain only uppercase alphanumeric characters',
      'string.min': 'Project key must be at least 2 characters',
      'string.max': 'Project key cannot exceed 10 characters',
    }),
  description: Joi.string().trim().max(1000).allow('', null).optional(),
  memberIds: Joi.array().items(Joi.string().uuid()).optional(),
});

export const updateProjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).optional(),
  description: Joi.string().trim().max(1000).allow('', null).optional(),
  memberIds: Joi.array().items(Joi.string().uuid()).optional(),
}).min(1);

export const projectIdParamSchema = Joi.object({
  projectId: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid Project ID format (UUID expected)',
  }),
});
