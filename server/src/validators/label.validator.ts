import Joi from 'joi';

export const createLabelSchema = Joi.object({
  projectId: Joi.string().uuid().required().messages({
    'string.empty': 'Project ID is required',
    'string.guid': 'Invalid Project ID format',
  }),
  name: Joi.string().trim().min(1).max(50).required().messages({
    'string.empty': 'Label name cannot be empty',
    'string.max': 'Label name cannot exceed 50 characters',
  }),
  color: Joi.string()
    .trim()
    .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .required()
    .messages({
      'string.pattern.base': 'Color must be a valid hex code (e.g. #3b82f6)',
    }),
});

export const labelQuerySchema = Joi.object({
  projectId: Joi.string().uuid().required().messages({
    'string.empty': 'Project ID query parameter is required',
    'string.guid': 'Invalid Project ID format',
  }),
});
