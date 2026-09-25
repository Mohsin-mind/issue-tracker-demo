# Task Phases & Execution Tracker

This document tracks the phased execution of the **Mini Jira/Trello Issue Tracker**. Each phase must be completed, tested, and validated before moving to the next.

---

## 📌 Phase Summary Status

| Phase | Description | Status |
|---|---|---|
| **Phase 1** | Project Setup & Base Architecture | 🟢 Completed |
| **Phase 2** | Database Layer, Models, Migrations & Seeders | 🟢 Completed |
| **Phase 3** | Backend RESTful APIs & Service Layer | 🟢 Completed |
| **Phase 4** | Frontend Foundation, Design System & Dashboard | 🟢 Completed |
| **Phase 5** | Interactive Kanban Board with Drag & Drop | 🟢 Completed |
| **Phase 6** | Issue Management, Detail Drawer, Comments & Filters | 🟢 Completed |
| **Phase 7** | Polish, Responsive Design, AI Documentation & README | 🟢 Completed |
| **Phase 8** | Epic Management & Issue Hierarchy | 🟢 Completed |

---

## Phase 1 — Project Setup & Base Architecture
- [x] Initialize root configuration (`.env.example`, `.gitignore`, `pnpm-workspace.yaml`, `.npmrc`, `AGENTS.md`, `GEMINI.md`, `docs/`)
- [x] Setup `/server`:
  - [x] Initialize `package.json` with Express, Sequelize, TypeScript, Joi, CORS, Dotenv
  - [x] Configure `tsconfig.json`
  - [x] Create folder structure (`config/`, `constants/`, `controllers/`, `services/`, `models/`, `routes/`, `middlewares/`, etc.)
  - [x] Implement `AppError`, centralized error middleware, and `ApiResponse` helper
  - [x] Setup `app.ts` and `server.ts` with `/api/health` endpoint
- [x] Setup `/client`:
  - [x] Initialize Vite + React + TypeScript in `client/`
  - [x] Setup folder structure (`components/`, `pages/`, `layouts/`, `features/`, `stores/`, `styles/`, etc.)
  - [x] Setup Vanilla CSS design tokens (`styles/variables.css`, `styles/reset.css`, `styles/globals.css`, `styles/layout.css`)
  - [x] Setup React Router shell with base App layout (Sidebar, Topbar, Content Outlet)
- [x] **Verification**: Backend configured with health check and error middleware; Frontend configured with React Router, TanStack Query, Zustand store, and responsive App shell.

---

## Phase 2 — Database Layer, Models, Migrations & Seeders
- [x] Configure Sequelize database connection with environment variables (`mohsin_issue_tracker_demo`)
- [x] Define Sequelize Models (User, Project, ProjectMember, BoardColumn, Issue, Label, IssueLabel, Comment)
- [x] Define Model Associations, Cascade rules, and unique composite indexes
- [x] Write DB Migration script / schema synchronization (`src/database/init-db.ts`)
- [x] Write DB Seeders (4 realistic users, 2 projects, 10 columns, 22 issues with varied priorities/assignees, labels, comments)
- [x] Add `db:init`, `db:seed`, `db:reset`, and `test:db` scripts
- [x] **Test Cases & Verification**:
  - [x] Write automated verification test suite (`src/database/verify-db.ts`)
  - [x] Test 1: User uniqueness and avatar colors
  - [x] Test 2: Project key uniqueness & cascade deletes
  - [x] Test 3: Project-member association constraints
  - [x] Test 4: Issue key generation & project-scoped unique numbering `(project_id, issue_number)`
  - [x] Test 5: Drag & drop position ordering within columns
  - [x] Test 6: Seeder integrity check (verifying 4 users, 2 projects, 10 columns, 22 issues)

---

## Phase 3 — Backend RESTful APIs & Service Layer
- [x] Implement Joi request validators (`project`, `issue`, `comment`, `label`)
- [x] Implement Service Layer (`project.service.ts`, `issue.service.ts`, `comment.service.ts`, `user.service.ts`, `label.service.ts`)
- [x] Implement Controllers with thin logic delegating to Services
- [x] Implement Express Routes for all required endpoints
- [x] Implement atomic issue key increment and position movement logic
- [x] **Test Cases & Verification**:
  - [x] Write API integration test suite (`tests/api.test.ts`)
  - [x] Test 1: `GET /api/health` returns status UP
  - [x] Test 2: `GET /api/projects` and `GET /api/projects/:projectId/board` return eager-loaded structures
  - [x] Test 3: `POST /api/issues` validates project membership and creates sequential key
  - [x] Test 4: `PATCH /api/issues/:issueId/move` updates column & position in transaction
  - [x] Test 5: `POST /api/issues/:issueId/comments` adds comment and `DELETE` cascades cleanly
  - [x] Test 6: Joi validation returns 400 for invalid inputs
  - [x] Test 7: Centralized error handling returns proper error envelope

---

## Phase 4 — Frontend Foundation, Design System & Dashboard
- [x] Build reusable UI component library with Vanilla CSS & Tailwind v4 (Button, Input, Select, Badge, Avatar, Modal, EmptyState, ConfirmDialog, LoadingSkeleton)
- [x] Configure Tailwind CSS v4 (`@tailwindcss/vite`, `@theme`) and document in `docs/tailwind-v4-guide.md`
- [x] Configure Git remote `https://github.com/Mohsin-mind/issue-tracker-demo` without committing
- [x] Implement responsive App Shell with collapsible Sidebar and Topbar (with Demo User Switcher)
- [x] Setup TanStack Query provider and API service layer (`apiClient`, `projectService`, `issueService`, `commentService`, `userService`, `labelService`)
- [x] Implement Zustand stores (`useUserStore`, `useUIStore`)
- [x] Implement Dashboard Page with project cards, issue metrics, and recently updated stream
- [x] Implement Projects listing page with CreateProjectModal
- [x] **Test Cases & Verification**:
  - [x] Component rendering tests (Button, Badge, Avatar, Modal, ConfirmDialog)
  - [x] User switcher updates Zustand store and triggers reactive persona updates
  - [x] TanStack Query successfully fetches and caches project list & metrics
  - [x] Navigation transitions between Dashboard and Projects without layout shift

---

## Phase 5 — Interactive Kanban Board with Drag & Drop
- [x] Implement Project Board layout (`/projects/:projectId`) with team member avatars and header
- [x] Implement Column component (`KanbanColumn.tsx`) with status header, counter, quick add button, and drop area
- [x] Implement IssueCard component (`IssueCard.tsx`) with key, title, priority pill, assignee avatar, label pills, and comments count
- [x] Integrate `@hello-pangea/dnd` for intra-column and cross-column reordering (`KanbanBoard.tsx`)
- [x] Wire optimistic TanStack Query mutations with rollback on error (`useMoveIssue.ts`)
- [x] Implement Quick Issue creation modal (`CreateIssueModal.tsx`) with column selection, priority, assignee, and due date
- [x] **Test Cases & Verification**:
  - [x] Drag-and-drop intra-column reordering and cross-column movement test (`board-functionality.test.ts`)
  - [x] Optimistic UI update and error rollback verification
  - [x] Database persistence tested and verified via backend API test suite (Test 6: `PATCH /api/issues/:issueId/move`)
  - [x] Clean client production bundle built with 0 errors (`tsc && vite build`)

---

## Phase 6 — Issue Management, Detail Drawer, Comments & Filters
- [x] Implement Issue Detail Drawer (`IssueDetailDrawer.tsx`) with inline editing for title, description, column, priority, assignee, due date
- [x] Implement Comment timeline (`CommentsSection.tsx`) with real-time posting and author-scoped deletion
- [x] Implement real-time board search by key/title (`BoardFilterBar.tsx`)
- [x] Implement multi-criteria filters (Priority, Assignee, Unassigned)
- [x] Implement Issue deletion with reusable `ConfirmDialog` modal
- [x] **Test Cases & Verification**:
  - [x] Real-time filter tests (`filter-and-detail.test.ts`): search by keyword, filter by priority, assignee, and combined
  - [x] Detail drawer inline edit updates state
  - [x] Comment timeline append and deletion test
  - [x] Full production build verified (`tsc && vite build`) with 0 errors

---

## Phase 7 — Polish, Responsive Design, AI Documentation & README
- [x] Responsive design adjustments (mobile/tablet horizontally scrolling board, collapsible sidebar, responsive layout grid)
- [x] Clean Light Theme styling implemented across all screens (Jira/Linear style) with Tailwind CSS v4
- [x] Root handshake URL added on backend (`GET /` on port 3000)
- [x] Skeleton loading states and empty state visual enhancements
- [x] Confirmation dialogs for destructive actions (`ConfirmDialog.tsx`)
- [x] Root `README.md` with full setup instructions, architecture diagram, and test commands
- [x] Final verification of build (`tsc && vite build` on client and `tsc` on server)
- [x] **Test Cases & Verification**:
  - [x] End-to-end user scenario validation (create project -> create issue -> drag & drop -> comment -> filter)
  - [x] Clean type check across entire monorepo with 0 errors
  - [x] Verified database tests (`pnpm run test:db` -> 6/6 passed) and API tests (`pnpm run test:api` -> 7/7 passed)

---

## Phase 8 — Epics, Issue Types & Hierarchy (Epic, Story, Bug, Task)
- [x] **Database Layer (Models & Schema Sync)**:
  - [x] Create `Epic` Sequelize model (`server/src/models/epic.model.ts`):
    - `id` (UUID PK)
    - `project_id` (UUID FK -> `projects.id`, ON DELETE CASCADE)
    - `name` (string, max 100, not null)
    - `description` (text, nullable)
    - `color` (string hex code, e.g. `#8b5cf6`, `#f59e0b`, `#06b6d4`, `#ec4899`)
    - `status` (ENUM: `'TODO'`, `'IN_PROGRESS'`, `'DONE'`, default `'TODO'`)
    - `created_at`, `updated_at`
  - [x] Update `Issue` model (`server/src/models/issue.model.ts`):
    - Add `type` (ENUM: `'STORY'`, `'BUG'`, `'TASK'`, default `'TASK'`, not null)
    - Add `epic_id` (UUID FK -> `epics.id`, nullable, ON DELETE SET NULL)
  - [x] Define associations:
    - `Project.hasMany(Epic, { foreignKey: 'project_id', as: 'epics' })`
    - `Epic.belongsTo(Project, { foreignKey: 'project_id', as: 'project' })`
    - `Epic.hasMany(Issue, { foreignKey: 'epic_id', as: 'issues' })`
    - `Issue.belongsTo(Epic, { foreignKey: 'epic_id', as: 'epic' })`
  - [x] Update seeders (`demo-data.seeder.ts`) to seed realistic demo Epics and populate `type` (`STORY`, `BUG`, `TASK`) and `epic_id` across demo issues
- [x] **Backend RESTful APIs & Service Layer**:
  - [x] Create Joi schemas (`server/src/validators/epic.validator.ts`):
    - `createEpicSchema` (`name`, `description`, `color`, `status`)
    - `updateEpicSchema` (`name`, `description`, `color`, `status`)
    - `epicIdParamSchema` (`epicId`)
  - [x] Update `issue.validator.ts` to validate `type` (`STORY`, `BUG`, `TASK`) and `epicId` (nullable UUID)
  - [x] Create `EpicService` (`server/src/services/epic.service.ts`):
    - `getEpicsByProject(projectId)` (with aggregated child issue counts and completion metrics)
    - `getEpicById(epicId)` (with child issues list)
    - `createEpic(projectId, data)`
    - `updateEpic(epicId, data)`
    - `deleteEpic(epicId)` (sets child `issue.epic_id` to null via foreign key cascade)
  - [x] Implement `EpicController` (`server/src/controllers/epic.controller.ts`) and routes:
    - `GET /api/projects/:projectId/epics`
    - `POST /api/projects/:projectId/epics`
    - `GET /api/epics/:epicId`
    - `PUT /api/epics/:epicId`
    - `DELETE /api/epics/:epicId`
  - [x] Update `IssueService` to accept `type` and `epicId` on `createIssue` and `updateIssue`, and eager-load `Epic` association in `getProjectBoard`, `getIssueById`, and `getAllIssues`
- [x] **Frontend Integration (Epic Badges, Issue Type Icons, Selectors & Board Panel)**:
  - [x] Implement TypeScript types (`client/src/types/index.ts`): `Epic`, `EpicStatus`, `IssueType` (`'STORY' | 'BUG' | 'TASK'`)
  - [x] Implement `epicService.ts` and TanStack Query hooks (`useEpics`, `useCreateEpic`, `useUpdateEpic`, `useDeleteEpic`)
  - [x] Create `IssueTypeIcon.tsx` (📗 Story, 🔴 Bug, 📘 Task) with Jira visual semantics
  - [x] Create `EpicBadge.tsx` displaying colored pill tag with Epic name
  - [x] Display `IssueTypeIcon` and `EpicBadge` on Kanban cards (`IssueCard.tsx`)
  - [x] Add Issue Type & Epic selectors in `CreateIssueModal.tsx`
  - [x] Add Issue Type & Epic inline controls in `IssueDetailDrawer.tsx`
  - [x] Add Issue Type and Epic filter dropdowns to `BoardFilterBar.tsx`
  - [x] Add `CreateEpicModal.tsx` and Epics Drawer/Panel on the project board page showing progress bars (`done_issues / total_issues`)
- [x] **Test Cases & Verification**:
  - [x] Backend API test cases in `server/src/tests/api.test.ts` (Epic CRUD, issue type persistence, epic deletion orphan safety -> 8/8 tests passed)
  - [x] Frontend unit tests for `EpicBadge`, `IssueTypeIcon`, and board filtering (10/10 test files, 51/51 tests passed)
  - [x] Verification of monorepo build (`tsc` on server & `vite build` on client) with 0 errors



