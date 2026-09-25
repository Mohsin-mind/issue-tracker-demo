# Database Schema Specification — Issue Tracker Demo

## 1. Overview
The database uses PostgreSQL with Sequelize ORM. All entities use UUID v4 primary keys to guarantee uniqueness across environments.

---

## 2. Table Schemas

### `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, Default: UUIDV4 | Unique user ID |
| `name` | VARCHAR(100) | NOT NULL | Full name of the user |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | User email address |
| `avatar_color` | VARCHAR(20) | NOT NULL | Hex color or avatar identifier |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, Default: NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, Default: NOW() | Update timestamp |

---

### `projects`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, Default: UUIDV4 | Unique project ID |
| `name` | VARCHAR(150) | NOT NULL | Project name (e.g. Estate Planning) |
| `key` | VARCHAR(10) | NOT NULL, UNIQUE | Project key prefix (e.g. WOLF, APP) |
| `description` | TEXT | NULLABLE | Detailed project description |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, Default: NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, Default: NOW() | Update timestamp |

---

### `project_members`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, Default: UUIDV4 | Membership record ID |
| `project_id` | UUID | NOT NULL, FK -> projects(id) ON DELETE CASCADE | Associated project |
| `user_id` | UUID | NOT NULL, FK -> users(id) ON DELETE CASCADE | Associated user |
| Unique index on `(project_id, user_id)` to prevent duplicate memberships. |

---

### `board_columns`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, Default: UUIDV4 | Column ID |
| `project_id` | UUID | NOT NULL, FK -> projects(id) ON DELETE CASCADE | Parent project |
| `name` | VARCHAR(50) | NOT NULL | Backlog, To Do, In Progress, Review, Done |
| `position` | INTEGER | NOT NULL | Display order of column (0, 1, 2, 3, 4) |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, Default: NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, Default: NOW() | Update timestamp |

---

### `issues`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, Default: UUIDV4 | Issue record ID |
| `project_id` | UUID | NOT NULL, FK -> projects(id) ON DELETE CASCADE | Parent project |
| `column_id` | UUID | NOT NULL, FK -> board_columns(id) ON DELETE RESTRICT | Current column |
| `issue_number`| INTEGER | NOT NULL | Sequential number within project (1, 2, 3...) |
| `title` | VARCHAR(255) | NOT NULL | Brief summary of the issue |
| `description`| TEXT | NULLABLE | Full issue description / markdown |
| `priority` | ENUM | NOT NULL, Default: 'MEDIUM' | 'LOW', 'MEDIUM', 'HIGH', 'URGENT' |
| `assignee_id` | UUID | NULLABLE, FK -> users(id) ON DELETE SET NULL | Assigned user |
| `reporter_id` | UUID | NOT NULL, FK -> users(id) ON DELETE RESTRICT | Reporting user |
| `position` | DOUBLE PRECISION | NOT NULL | Ordering position within column |
| `due_date` | DATE | NULLABLE | Optional due date |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, Default: NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, Default: NOW() | Update timestamp |
| Unique index on `(project_id, issue_number)` guarantees unique project-scoped issue keys. |

---

### `labels`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, Default: UUIDV4 | Label ID |
| `project_id` | UUID | NOT NULL, FK -> projects(id) ON DELETE CASCADE | Scoped project |
| `name` | VARCHAR(50) | NOT NULL | Label tag (Bug, Feature, UI/UX, etc.) |
| `color` | VARCHAR(20) | NOT NULL | Hex color code (e.g. `#EF4444`) |
| Unique index on `(project_id, name)`. |

---

### `issue_labels`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `issue_id` | UUID | NOT NULL, FK -> issues(id) ON DELETE CASCADE | Associated issue |
| `label_id` | UUID | NOT NULL, FK -> labels(id) ON DELETE CASCADE | Associated label |
| Composite PK on `(issue_id, label_id)`. |

---

### `comments`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, Default: UUIDV4 | Comment record ID |
| `issue_id` | UUID | NOT NULL, FK -> issues(id) ON DELETE CASCADE | Associated issue |
| `user_id` | UUID | NOT NULL, FK -> users(id) ON DELETE CASCADE | Comment author |
| `body` | TEXT | NOT NULL | Comment message text |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, Default: NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, Default: NOW() | Update timestamp |
