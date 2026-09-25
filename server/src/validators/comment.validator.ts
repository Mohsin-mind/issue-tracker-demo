import Joi from 'joi';

export const createCommentSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    'string.empty': 'User ID is required',
    'string.guid': 'Invalid User ID format',
  }),
  body: Joi.string().trim().min(1).max(5000).required().messages({
    'string.empty': 'Comment body cannot be empty',
    'string.max': 'Comment exceeds maximum length of 5000 characters',
  }),
});

export const commentIdParamSchema = Joi.object({
  commentId: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid Comment ID format (UUID expected)',
  }),
});
