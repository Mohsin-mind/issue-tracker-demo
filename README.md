# AgileFlow — Production Mini Jira/Trello Issue Tracker

A full-stack, production-grade project management application inspired by modern Jira and Linear, built with React 18, TypeScript, Tailwind CSS v4, Node.js + Express, Sequelize ORM, and PostgreSQL.

---

## 🌟 Key Features

- **Interactive Kanban Board**: Smooth drag-and-drop issue movement (`@hello-pangea/dnd`) with optimistic updates and error rollback.
- **Floating Position Indexing**: Precise intra-column reordering and cross-column state transitions inside atomic database transactions.
- **Issue Detail Slide-Over**: Inline editable title and description, column status picker, priority selector, assignee assignment, and due date.
- **Real-Time Board Filters**: Instant keyword search (by title or key like `WOLF-1`), priority filter (`Low`, `Medium`, `High`, `Urgent`), and assignee filter (`Unassigned`, team members).
- **Activity & Comments Timeline**: Chronological comment stream with live posting and author-scoped comment deletion.
- **Executive Dashboard**: Cross-project velocity metrics, issue distribution counters, active project cards, and recent activity feed.
- **Demo Persona Switcher**: Topbar persona switcher toggling active users across all comments and assignments with zero auth friction.
- **Clean Light Theme**: Crisp, modern light mode aesthetic styled with **Tailwind CSS v4** and strict DRY design tokens.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite 5, Tailwind CSS v4 (`@tailwindcss/vite`), TanStack Query v5, Zustand, `@hello-pangea/dnd`, Lucide Icons |
| **Backend** | Node.js, Express, TypeScript, Sequelize ORM, Joi validation, central error middleware (`AppError`) |
| **Database** | PostgreSQL with transactions, composite indexes, and cascade deletion constraints |
| **Monorepo** | pnpm workspaces (`client`, `server`) |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on v24)
- **pnpm** v10+ (tested on v12)
- **PostgreSQL** instance running locally or on local network

---

### 2. Environment Configuration

#### Backend (`server/.env`):
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=mohsin_issue_tracker_demo
DB_USER=postgres
DB_PASSWORD=your_password

CLIENT_URL=http://localhost:3001
```

---

### 3. Install Dependencies
```bash
# From workspace root
pnpm install
```

---

### 4. Database Setup & Seeding
Initialize the database tables and seed realistic demo projects (`WOLF` & `APP`), 4 team personas, and 22 issues:
```bash
cd server
pnpm run db:reset
```

---

### 5. Running the Application

#### Start Backend (Port 3000):
```bash
cd server
pnpm run dev
```
*Health check:* `http://localhost:3000/api/health`  
*API Handshake:* `http://localhost:3000/`

#### Start Frontend (Port 3001):
```bash
cd client
pnpm run dev
```
Open **`http://localhost:3001`** in your browser.

---

## 🧪 Automated Test Suites

### Backend Test Suites
```bash
cd server

# Run Phase 2 Database integrity & constraint tests (6 tests)
pnpm run test:db

# Run Phase 3 RESTful API integration tests (7 tests)
pnpm run test:api
```

### Frontend Test Suite
```bash
cd client

# Run Vitest functional tests (board calculation, filters, store state)
pnpm test
```

---

## 📂 Project Structure

```text
issue-tracker-demo/
├── client/
│   ├── src/
│   │   ├── components/       # Common DRY UI primitives (Button, Input, Badge, Avatar, Modal, etc.)
│   │   ├── features/         # Feature modules
│   │   │   ├── board/        # KanbanBoard, KanbanColumn, IssueCard, BoardFilterBar
│   │   │   └── issues/       # IssueDetailDrawer, CommentsSection, CreateIssueModal
│   │   ├── hooks/            # TanStack Query custom hooks (useProjectBoard, useMoveIssue, useIssue, etc.)
│   │   ├── layouts/          # AppLayout, Sidebar, Topbar
│   │   ├── pages/            # DashboardPage, ProjectsPage, ProjectBoardPage
│   │   ├── services/         # Axios API clients
│   │   ├── stores/           # Zustand stores (useUserStore, useUIStore)
│   │   └── styles/           # Tailwind v4 globals.css, variables.css, components.css
│   ├── vite.config.ts
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/           # Database & server configuration
│   │   ├── controllers/      # Thin HTTP controllers
│   │   ├── database/         # Init script, verify-db test suite, demo seeders
│   │   ├── models/           # Sequelize models & associations
│   │   ├── routes/           # Express router endpoints
│   │   ├── services/         # Rich business logic layer & transactions
│   │   ├── tests/            # API integration test suite
│   │   ├── validators/       # Joi request schemas
│   │   ├── app.ts            # Express setup & root handshake endpoint
│   │   └── server.ts         # Server entrypoint
│   └── package.json
├── docs/                     # System architecture, task phases, and Tailwind v4 guide
├── AGENTS.md                 # Agent & development guidelines
├── GEMINI.md                 # Antigravity rules & standards
└── README.md                 # Project README
```

---

## 👥 Seeded Demo Personas

Switch between these personas anytime via the Topbar dropdown:
1. **John Smith** (Engineering Lead) — `#6366f1`
2. **Sarah Connor** (Senior Full-Stack Engineer) — `#10b981`
3. **David Miller** (Product Manager) — `#f59e0b`
4. **Emily Watson** (QA & Release Specialist) — `#ec4899`

---

## 📄 License
MIT
