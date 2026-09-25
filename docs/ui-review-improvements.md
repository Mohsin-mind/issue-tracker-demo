# UI Review & Layout Spacing Improvements

A concise audit of UI/UX layout, padding, and container spacing across all pages of the **AgileFlow Issue Tracker**, based on the reference dashboard snapshot and codebase inspection.

---

## 1. Executive Dashboard (`/`) — Issues Identified from Reference Image

| UI Element | Observed Issue in Reference | Recommended Fix |
| :--- | :--- | :--- |
| **Topbar Global Search** | Search icon (`Search`) overlaps the placeholder text `"Search issues..."`. | Increase input left padding to `pl-11` or `pl-12` and position icon at `left-3.5`. |
| **Topbar Persona Switcher** | Unstyled/tight native select element squeezed against the user name with no visual container. | Wrap in a styled pill container (`px-3.5 py-1.5 rounded-xl border bg-slate-50`) with avatar and clean typography. |
| **Metric Cards (Top Row)** | Cards lack internal padding; titles touch the top-left corner, and subtext (`Across 2 active projects`) touches the bottom border. | Standardize to `p-6` internal padding, increase gap between metric number and labels to `gap-2.5`. |
| **Active Projects Cards** | Key pill (`APP`, `WOLF`) touches top border; member count and `Open Board` button touch the bottom edge with no breathing room. | Apply consistent `p-6` card padding, `pt-4` footer margin, and `gap-3.5` between content rows. |
| **Recent Issue Activity Stream** | Issue rows touch the left container border (`0px` left inset); timestamps/avatars touch the right border; top/bottom items flush to outer edges. | Wrap outer container in `p-5 bg-white rounded-2xl border`, add `p-3.5` inside each issue row item with `gap-3`. |

---

## 2. Kanban Board Page (`/projects/:id`)

| UI Element | Observed Issue | Recommended Fix |
| :--- | :--- | :--- |
| **Filter Bar Container** | Squeezed controls on medium viewports; priority/assignee dropdowns lack internal padding for dropdown arrow. | Set container padding to `p-4`, input padding to `pl-10 pr-4`, and select controls to `h-10 px-3.5 pr-8`. |
| **Kanban Columns** | Droppable issue list touches column edges when dragging; empty state box too short (`h-24`). | Use `p-3.5` container padding for columns, `min-h-48` droppable area, and `p-3` between issue cards. |
| **Issue Cards** | Card footer (`due date`, `comments`, `assignee`) feels compressed against the card title or label tags. | Ensure `p-4` card padding, `pt-3 mt-1 border-t` for card footer, and `gap-2.5` between metadata badges. |
| **Header Member Avatars** | Avatar circles overlap too tightly without visible borders. | Add `ring-2 ring-white` around overlapping avatars and `px-2 py-1` wrapper padding. |

---

## 3. Issue Detail Drawer (`IssueDetailDrawer.tsx`)

| UI Element | Observed Issue | Recommended Fix |
| :--- | :--- | :--- |
| **Drawer Header** | Close and delete buttons sit too close to the top-right edge. | Ensure header has `h-16 px-6` with centered action icon buttons (`p-2 rounded-lg`). |
| **Properties Grid Container** | Status, Priority, Assignee, and Due Date fields feel boxed in on mobile/narrow screens. | Set container to `p-5 rounded-2xl bg-slate-50 border` with `gap-4`, inputs/selects to `h-10 px-3.5`. |
| **Inline Title Editor** | Title text shifts position between view mode and edit mode. | Use `p-2 -ml-2 rounded-xl` on view heading to match the edit input padding seamlessly. |
| **Comments & Activity Stream** | Comment input textarea has cramped padding; comment cards lack left inset padding from avatar. | Use `p-3.5` for comment textarea, `p-3.5` inside comment bubbles with `gap-3` between avatar and text. |

---

## 4. Projects Directory Page (`/projects`)

| UI Element | Observed Issue | Recommended Fix |
| :--- | :--- | :--- |
| **Project Grid Cards** | Description text can push footer buttons unevenly across cards if descriptions vary in length. | Set cards to `p-6 flex flex-col justify-between`, use `line-clamp-2` or `line-clamp-3` on description, and keep footer locked to bottom with `mt-auto pt-4 border-t`. |
| **Header Spacing** | Header title and `Create Project` button gap narrows on tablet screens. | Ensure `pb-8` margin below header and `gap-4 flex-wrap`. |

---

## 5. Form Modals & Shared UI Primitives (`components.css` & `common/`)

| Component | Target Spacing Standard |
| :--- | :--- |
| **`Input` & `Select`** | `height: 42px`, `padding: 10px 14px` (`padding-left: 42px` when prefixed with an icon, `padding-right: 36px` on selects for arrow). |
| **`Textarea`** | `min-height: 100px`, `padding: 12px 14px`, `line-height: 1.5`. |
| **`Modal` Container** | Header: `px-6 py-4.5`; Body: `p-6` with `gap-5`; Footer: `px-6 py-4`. |
| **`Button`** | `sm`: `h-8 px-3.5`; `md`: `h-10 px-4.5`; `lg`: `h-12 px-6`. Icon gap: `gap-2`. |
| **`Badge`** | `px-2.5 py-0.5 rounded-full text-xs font-semibold`. |
