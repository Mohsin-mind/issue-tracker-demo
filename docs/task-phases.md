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
| **Phase 7** | Polish, Responsive Design, AI Documentation & README | 🟡 Ready to Begin |

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
- [ ] Responsive design adjustments (mobile/tablet horizontally scrolling board)
- [ ] Skeleton loading states and empty state visual enhancements
- [ ] Confirmation dialogs for destructive actions
- [ ] Root `README.md` with full setup instructions
- [ ] Final verification of build (`pnpm run build` on client and server)
- [ ] **Test Cases & Verification**:
  - [ ] End-to-end user scenario validation (create project -> create issue -> drag -> comment -> filter)
  - [ ] Clean type check across entire monorepo (`tsc --noEmit`)
  - [ ] Audit zero console errors / warnings in browser and server

