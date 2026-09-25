# REST API Specification — Issue Tracker Demo

Base URL: `http://localhost:5000/api`

Standard Response Structure:
```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

Standard Error Structure:
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": []
  }
}
```

---

## 1. Projects API

### `GET /api/projects`
Returns all projects with their total issue count and member count.

### `POST /api/projects`
Creates a project and automatically seeds its 5 standard board columns.
```json
{
  "name": "Estate Planning Platform",
  "key": "WOLF",
  "description": "Platform for handling legal documents",
  "memberIds": ["user-uuid-1", "user-uuid-2"]
}
```

### `GET /api/projects/:projectId`
Returns project details, columns, and assigned members.

### `PUT /api/projects/:projectId`
Updates project name and description.

### `DELETE /api/projects/:projectId`
Cascades and deletes project and related columns, issues, labels, comments.

### `GET /api/projects/:projectId/board`
Returns complete board state:
- Project info
- Columns sorted by `position` ASC
- Issues grouped by column or flat list, sorted by `position` ASC
- Attached labels and assignee details

### `GET /api/projects/:projectId/statistics`
Returns summary metrics:
```json
{
  "totalIssues": 24,
  "openIssues": 12,
  "inProgressIssues": 7,
  "completedIssues": 5
}
```

---

## 2. Issues API

### `GET /api/issues`
Query params: `projectId`, `search`, `columnId`, `priority`, `assigneeId`, `labelId`.

### `POST /api/issues`
Creates an issue with next auto-incremented `issue_number` for the project.
```json
{
  "projectId": "uuid",
  "columnId": "uuid",
  "title": "Fix PDF generation bug",
  "description": "Text or markdown",
  "priority": "HIGH",
  "assigneeId": "uuid",
  "reporterId": "uuid",
  "labelIds": ["uuid"],
  "dueDate": "2026-10-15"
}
```

### `GET /api/issues/:issueId`
Returns full issue details, labels, assignee, reporter, and comments.

### `PUT /api/issues/:issueId`
Updates issue attributes (title, description, priority, assigneeId, dueDate, labelIds).

### `DELETE /api/issues/:issueId`
Deletes issue and associated comments and labels.

### `PATCH /api/issues/:issueId/move`
Atomic drag-and-drop movement.
```json
{
  "targetColumnId": "uuid",
  "newPosition": 2.5
}
```

---

## 3. Comments API

### `GET /api/issues/:issueId/comments`
Returns chronological list of comments for an issue.

### `POST /api/issues/:issueId/comments`
```json
{
  "userId": "uuid",
  "body": "Fixed in commit 3df2a1."
}
```

### `DELETE /api/comments/:commentId`
Deletes comment.

---

## 4. Users & Labels API

### `GET /api/users`
Returns list of all users with `id`, `name`, `email`, `avatar_color`.

### `GET /api/labels?projectId=:projectId`
Returns labels scoped to the project.

### `POST /api/labels`
```json
{
  "projectId": "uuid",
  "name": "Frontend",
  "color": "#3B82F6"
}
```
