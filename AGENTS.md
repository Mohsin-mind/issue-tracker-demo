# AGENTS.md — Development Guidelines for Issue Tracker Demo

This file serves as the definitive reference and operational guide for AI agents and developers working on the **Mini Jira/Trello Issue Tracker**.

---

## 1. Project Overview & Architectural Boundaries

A full-stack, production-grade project management application featuring:
- **Client**: React 18+ + Vite + TypeScript, React Router, TanStack Query v5, Zustand, `@hello-pangea/dnd`, Vanilla CSS design system.
- **Server**: Node.js + Express + TypeScript, PostgreSQL, Sequelize ORM, Joi validation, custom `AppError` + centralized error middleware.
- **Monorepo Structure**:
  - `/client`: Frontend SPA
  - `/server`: RESTful API backend
  - `/docs`: Architecture, task phases, and system documentation

---

## 2. Invariant Rules & Best Practices

### Backend Standards
1. **Thin Controllers, Rich Services**: Controllers only extract input, invoke service methods, and return standard JSON via response helpers (`ApiResponse.success`). All business logic, transactions, and validation invariants belong in `src/services/`.
2. **Standard API Response Envelope**:
   ```json
   {
     "success": true,
     "data": {},
     "message": "Success message"
   }
   ```
3. **Error Handling**: Throw `AppError(message, statusCode)`. The centralized error middleware catches all errors and responds with:
   ```json
   {
     "success": false,
     "error": {
       "message": "Error details",
       "code": "STATUS_CODE"
     }
   }
   ```
4. **Joi Validation**: Validate all `body`, `query`, and `params` through Joi schemas before hitting controllers.
5. **Issue Keys & Numbering**: Issue keys are formatted as `${project.key}-${issue_number}` (e.g., `WOLF-1`). `issue_number` must auto-increment atomically within the project using transactions.
6. **Drag & Drop Position Calculation**: Issue ordering inside columns is controlled by a numeric `position` field. Updates use floating-point midpoints or sequential re-indexing in a database transaction.
7. **No Hardcoded Credentials**: All DB and server configurations must load from environment variables via `src/config/`.

### Frontend Standards & DRY Component Architecture
1. **Strict DRY Principle (Don't Repeat Yourself)**:
   - **Never duplicate UI primitives**: Inputs, buttons, selects, badges, avatars, and modals must never be re-implemented as ad-hoc HTML elements in feature components. Always import from `src/components/common/`.
   - **Never duplicate API call logic**: All HTTP requests are encapsulated in `src/services/` and consumed via TanStack Query custom hooks in `src/hooks/` or feature hooks. Never call `axios` or `fetch` directly inside component JSX files.
   - **Never duplicate styling rules**: Use CSS custom properties from `src/styles/variables.css` and shared utility classes from `src/styles/globals.css`. Do not write duplicate inline CSS blocks for borders, shadows, colors, or flexbox layouts.
2. **Mandatory Reusable Component Contracts**:
   - `Button`: Supports `variant` (`primary`, `secondary`, `danger`, `ghost`, `outline`), `size` (`sm`, `md`, `lg`), `isLoading`, and `icon`.
   - `Input` & `Textarea`: Standardized wrapper with `label`, `error`, `helperText`, and focus glow states.
   - `Select`: Custom dropdown or styled select with consistent dark theme styling and label/error bindings.
   - `Badge`: Standardized priority pills (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) and status indicators.
   - `Avatar`: Fallback initials with deterministic color generation from `avatar_color` attribute.
   - `Modal` / `Drawer`: Single flexible overlay container managing ESC key handling, focus traps, backdrop blur, and scroll lock.
   - `EmptyState`: Reusable empty placeholder with icon, title, description, and optional action button.
   - `LoadingSkeleton`: Shimmer effect skeleton loaders for cards, tables, and boards.
   - `ConfirmDialog`: Reusable confirmation dialog for all destructive operations (deleting issues, comments, projects).
3. **Styling Philosophy**: Powered by **Tailwind CSS v4** (`@tailwindcss/vite` and `@theme` configuration in `src/styles/globals.css`) paired with reusable design tokens in `src/styles/variables.css`. Maintain strict DRY component architecture.
4. **State Management**:
   - **Server State**: Managed via **TanStack Query** (`useQuery`, `useMutation`). Implement optimistic updates for Kanban drag & drop with error rollback.
   - **Client/UI State**: Managed via **Zustand** only for small global UI state (active demo user, sidebar collapse, filter criteria).
5. **No Auth Needed**: Use a Topbar user switcher that sets the active persona in the Zustand store (`currentUser`), which is sent in request headers or body for comments/issue creation.

---

## 3. Directory Layout

```text
issue-tracker-demo/
├── client/
│   ├── src/
│   │   ├── components/       # Reusable primitive UI components
│   │   ├── features/         # Feature modules (projects, board, issues, comments)
│   │   ├── hooks/            # Custom reusable hooks
│   │   ├── layouts/          # App Shell, Sidebar, Topbar
│   │   ├── pages/            # DashboardPage, ProjectBoardPage, ProjectsPage
│   │   ├── services/         # API clients (axios/fetch endpoints)
│   │   ├── stores/           # Zustand stores (useUserStore, useUIStore)
│   │   ├── styles/           # CSS tokens, reset, typography, globals
│   │   ├── types/            # Shared TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── server/
│   ├── src/
│   │   ├── config/           # Database & server env configuration
│   │   ├── constants/        # Enums, priorities, statuses, messages
│   │   ├── controllers/      # Thin HTTP request handlers
│   │   ├── database/         # Migrations & seeders
│   │   ├── helpers/          # ApiResponse and formatters
│   │   ├── middlewares/      # Error handler, Joi validator, logger
│   │   ├── models/           # Sequelize models & associations
│   │   ├── routes/           # Express router definitions
│   │   ├── services/         # Business logic layer
│   │   ├── types/            # TypeScript models & DTOs
│   │   ├── utils/            # General utilities
│   │   ├── validators/       # Joi schemas
│   │   ├── app.ts            # Express application setup
│   │   └── server.ts         # Server entrypoint
│   ├── .env.example
│   └── package.json
├── docs/                     # Architecture & Task Phase tracking
├── AGENTS.md                 # Agent instructions
└── README.md                 # Project README
```

---

## 4. Common Commands

```bash
# Backend (from /server)
pnpm run dev           # Start Express dev server with tsx/nodemon
pnpm run build         # Compile TypeScript
pnpm run db:migrate    # Run Sequelize migrations
pnpm run db:seed       # Run Sequelize seeders
pnpm run db:reset      # Drop, migrate, and seed database

# Frontend (from /client)
pnpm run dev           # Start Vite dev server (http://localhost:3001)
pnpm run build         # Type-check and build production bundle
```
