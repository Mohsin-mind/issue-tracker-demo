export enum IssuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum IssueType {
  STORY = 'STORY',
  BUG = 'BUG',
  TASK = 'TASK',
}

export enum EpicStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export const DEFAULT_COLUMNS = [
  { name: 'Backlog', position: 0 },
  { name: 'To Do', position: 1 },
  { name: 'In Progress', position: 2 },
  { name: 'Review', position: 3 },
  { name: 'Done', position: 4 },
];

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;
