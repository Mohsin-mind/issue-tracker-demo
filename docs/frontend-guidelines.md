# Frontend Architecture & DRY Component Guidelines

This document outlines the UI component standards, DRY (Don't Repeat Yourself) rules, and design token integration for the **Mini Jira/Trello Issue Tracker**.

---

## 1. Core Principles

1. **Primitive Reusability**: All primitive UI controls must reside under `client/src/components/common/`. Feature components (in `src/features/` and `src/pages/`) must NEVER write raw `<button>`, `<input>`, or styled modal divs directly.
2. **Zero Code Duplication**:
   - Centralize layout rules in CSS variables and utility classes.
   - Centralize API calls in `src/services/` and TanStack Query hooks.
   - Centralize formatting (dates, issue keys, priority labels) in `src/utils/formatters.ts`.
3. **Strict Vanilla CSS Tokens**: All colors, radiuses, shadows, and spacings MUST use CSS custom properties defined in `src/styles/variables.css`.

---

## 2. Reusable Component Inventory (`client/src/components/common/`)

| Component | Props | Purpose |
|---|---|---|
| `Button` | `variant` (`primary`, `secondary`, `danger`, `ghost`), `size`, `isLoading`, `icon`, `disabled`, `children` | Unified button with loading spinners and hover effects |
| `Input` | `label`, `error`, `helperText`, `icon`, standard HTML input props | Text, search, number inputs with validation errors |
| `Textarea` | `label`, `error`, `rows`, standard HTML textarea props | Expandable descriptions and comments input |
| `Select` | `label`, `error`, `options: Array<{ value, label }>` | Unified dropdown selection |
| `Badge` | `variant` (`priority`, `status`, `label`), `color`, `children` | Priority pills (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) and column tags |
| `Avatar` | `name`, `color`, `size` (`sm`, `md`, `lg`), `showName` | User avatar badge with fallback initials and color circle |
| `Modal` | `isOpen`, `onClose`, `title`, `size`, `children` | Centered modal with backdrop blur and ESC close |
| `Drawer` | `isOpen`, `onClose`, `title`, `width`, `children` | Slide-out drawer for issue details and editing |
| `ConfirmDialog`| `isOpen`, `title`, `message`, `confirmText`, `onConfirm`, `onCancel`, `isDestructive` | Confirmation before deleting issues, comments, or projects |
| `EmptyState` | `icon`, `title`, `description`, `action` | Clean empty state placeholder when lists/columns are empty |
| `LoadingSkeleton`| `type` (`card`, `text`, `avatar`, `column`), `count` | Shimmer animated skeletons for zero-layout-shift loading |

---

## 3. Anti-Patterns to Avoid

- ❌ **Anti-Pattern**: Writing `<button style={{ background: '#6366f1', padding: '8px 16px' }}>Save</button>` in a page.
  - ✅ **Correct**: `<Button variant="primary" onClick={handleSave}>Save</Button>`.
- ❌ **Anti-Pattern**: Fetching `/api/projects` using `axios.get` directly inside `useEffect` on `DashboardPage.tsx`.
  - ✅ **Correct**: `const { data: projects, isLoading } = useProjects();` with centralized caching and error handling.
- ❌ **Anti-Pattern**: Hardcoding priority colors like `color: '#ef4444'` inside Kanban cards.
  - ✅ **Correct**: `<PriorityBadge priority={issue.priority} />` using tokens `--priority-urgent`.
- ❌ **Anti-Pattern**: Re-writing confirmation prompts with `window.confirm`.
  - ✅ **Correct**: `<ConfirmDialog isOpen={isDeleting} onConfirm={handleDelete} title="Delete Issue" />`.

---

## 4. Shared Formatting Utilities (`client/src/utils/formatters.ts`)

- `formatIssueKey(projectKey: string, issueNumber: number): string` -> e.g. `WOLF-1`
- `formatDate(dateString: string): string` -> e.g. `Oct 12, 2026`
- `formatRelativeTime(dateString: string): string` -> e.g. `2 hours ago`
- `getPriorityColor(priority: Priority): { text: string; bg: string }`
