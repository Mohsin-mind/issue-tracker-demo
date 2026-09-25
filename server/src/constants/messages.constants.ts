export const API_MESSAGES = {
  HEALTH_OK: 'Issue Tracker API is running smoothly',
  SERVER_ERROR: 'An unexpected internal server error occurred',
  VALIDATION_ERROR: 'Validation failed for the request payload',
  NOT_FOUND: 'The requested resource was not found',
  PROJECT: {
    CREATED: 'Project created successfully',
    UPDATED: 'Project updated successfully',
    DELETED: 'Project deleted successfully',
    NOT_FOUND: 'Project not found',
    KEY_EXISTS: 'A project with this key already exists',
  },
  ISSUE: {
    CREATED: 'Issue created successfully',
    UPDATED: 'Issue updated successfully',
    DELETED: 'Issue deleted successfully',
    MOVED: 'Issue moved successfully',
    NOT_FOUND: 'Issue not found',
    INVALID_ASSIGNEE: 'Assignee must be a registered member of this project',
  },
  COMMENT: {
    CREATED: 'Comment added successfully',
    DELETED: 'Comment deleted successfully',
    NOT_FOUND: 'Comment not found',
  },
  LABEL: {
    CREATED: 'Label created successfully',
    NOT_FOUND: 'Label not found',
    ALREADY_EXISTS: 'Label name already exists in this project',
  },
  EPIC: {
    CREATED: 'Epic created successfully',
    UPDATED: 'Epic updated successfully',
    DELETED: 'Epic deleted successfully',
    NOT_FOUND: 'Epic not found',
  },
} as const;
