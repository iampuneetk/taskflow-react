# TaskFlow

> A production-style React task management application built to explore frontend architecture, cloud persistence, authentication, security boundaries, and deployment—not merely CRUD screens.

TaskFlow is an end-to-end task management application built with **React, Vite, Supabase, PostgreSQL, Row Level Security, and Vercel**.

The visible product is intentionally simple: users can create, organize, search, filter, update, complete, and delete tasks.

The engineering work behind it is broader:

- component design and state ownership
- controlled forms and validation
- immutable state updates
- derived data and client-side query pipelines
- reusable hooks
- global UI state with Context
- authentication and session handling
- database schema design
- secure user-level data isolation with Row Level Security
- API-based CRUD operations
- environment-variable management
- loading, error, and empty states
- responsive UI and keyboard interaction
- production deployment through GitHub and Vercel

TaskFlow was built as a learning project, but structured like a small real application.

---

## Live Demo

Add the deployed URL here:

```text
https://your-taskflow-project.vercel.app
```

Repository:

```text
https://github.com/your-username/taskflow-react
```

---

## Why This Project Exists

Many beginner projects stop at:

```text
Create → Read → Update → Delete
```

TaskFlow goes further by asking engineering questions such as:

- Where should state live?
- Which values should be stored, and which should be derived?
- When is Context appropriate?
- When is a custom hook useful?
- How should frontend and database naming conventions be mapped?
- How should authenticated users be isolated from one another?
- How should API failures affect the UI?
- When is debouncing necessary, and when is it unnecessary complexity?
- What changes when persistence moves from `localStorage` to PostgreSQL?
- How does a local React app become a deployed cloud application?

The project therefore acts as both:

1. a usable task application
2. a documented engineering learning journey

---

## Product Features

### Task Management

Users can:

- create tasks
- edit tasks
- delete tasks with confirmation
- mark tasks as active or completed
- add descriptions
- assign categories
- assign priorities
- set due dates
- identify overdue work

### Search, Filtering, and Sorting

Search works across:

- task title
- description
- category
- priority

Filters include:

- all, active, or completed tasks
- category
- priority

Sorting options include:

- newest first
- oldest first
- due date
- priority
- alphabetical order

Search, filters, and sorting can work together.

### Dashboard and Progress

The interface displays:

- total tasks
- active tasks
- completed tasks
- overdue tasks
- completion percentage
- visual progress bar

### Authentication and Cloud Persistence

TaskFlow includes:

- email/password signup
- login
- logout
- persisted Supabase sessions
- PostgreSQL-backed task storage
- user-specific task ownership
- Row Level Security policies
- cross-device access using the same account

### User Experience

- responsive desktop, tablet, and mobile layouts
- light and dark themes
- persisted theme preference
- loading states
- error states
- empty states
- keyboard shortcuts
- accessible labels
- semantic HTML
- defensive handling of incomplete data

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `N` | Focus the new-task title field |
| `/` | Focus the search field |
| `D` | Toggle light/dark mode |
| `Escape` | Cancel task editing |
| `Ctrl + Enter` | Submit the task form |

Shortcuts are ignored while the user is typing inside an input, textarea, select, or editable element. This prevents application shortcuts from interfering with normal form entry.

---

## Application Architecture

```text
Browser
  |
  v
React + Vite
  |
  +-- Authentication UI
  +-- Task Dashboard
  +-- Search / Filters / Sorting
  +-- Theme Context
  +-- Custom Hooks
  |
  v
Supabase JavaScript Client
  |
  +-- Supabase Auth
  +-- Data API
  |
  v
PostgreSQL
  |
  +-- tasks table
  +-- indexes
  +-- constraints
  +-- Row Level Security
  |
  v
Vercel Deployment
```

The frontend is deployed on Vercel. Authentication and database operations are handled through Supabase.

---

## Component Architecture

```text
ThemeProvider
└── AuthGate
    ├── AuthForm
    └── App
        ├── Header
        ├── TaskStats
        ├── TaskForm
        ├── SearchBar
        ├── TaskFilters
        └── TaskList
            └── TaskItem
```

Each component has one main responsibility.

| Component | Responsibility |
|---|---|
| `AuthGate` | Resolves the current session and decides whether to show authentication or the application |
| `AuthForm` | Handles signup and login |
| `Header` | Displays branding, task count, and theme controls |
| `TaskStats` | Derives progress and overdue metrics |
| `TaskForm` | Handles controlled task creation and editing |
| `SearchBar` | Controls search input |
| `TaskFilters` | Controls status, category, priority, and sort options |
| `TaskList` | Renders task collections and empty states |
| `TaskItem` | Displays and controls one task |
| `ThemeProvider` | Provides global theme state |
| `useTasks` | Encapsulates Supabase task CRUD |
| `useTheme` | Provides safe access to theme context |

This separation keeps UI rendering, application state, cloud access, and global configuration from collapsing into one large file.

---

## State Ownership

TaskFlow follows a single-source-of-truth approach.

Application-level state includes:

- authenticated user session
- task collection
- editing state
- search term
- status filter
- category filter
- priority filter
- sort option
- theme preference

Form state remains local to `TaskForm`.

Task data remains in the task hook and is shared with the page through returned values and functions.

The data flow is:

```text
User Action
    |
    v
Component Event Handler
    |
    v
App or Custom Hook Function
    |
    v
Supabase API Request
    |
    v
PostgreSQL
    |
    v
Updated React State
    |
    v
Re-rendered UI
```

---

## React Concepts Demonstrated

### Components

The application is split into focused components instead of one monolithic page.

This improves readability, reuse, testability, maintainability, and debugging.

### Props

Parent components pass data and callback functions to children.

```jsx
<TaskList
  tasks={sortedTasks}
  onToggleTask={toggleTask}
  onDeleteTask={deleteTask}
  onEditTask={setEditingTask}
/>
```

The child does not own the task collection. It reports user intent back to the parent.

### `useState`

`useState` manages form fields, editing mode, search, filters, sorting, loading, errors, authentication UI mode, and the current session.

### Controlled Inputs

Every form field is controlled by React state.

```jsx
<input
  name="title"
  value={formData.title}
  onChange={handleChange}
/>
```

A generic change handler updates the correct property using the input's `name`.

```jsx
function handleChange(event) {
  const { name, value } = event.target;

  setFormData((currentData) => ({
    ...currentData,
    [name]: value,
  }));
}
```

### Immutable Updates

Task objects and arrays are never modified directly.

```jsx
setTasks((currentTasks) =>
  currentTasks.map((task) =>
    task.id === updatedTask.id
      ? updatedTask
      : task
  )
);
```

Immutable updates make state changes predictable and allow React to detect what changed.

### Lists and Keys

Tasks are rendered using `.map()` and stable database IDs.

```jsx
tasks.map((task) => (
  <TaskItem key={task.id} task={task} />
));
```

Array indexes are not used as keys because task ordering and deletion can change.

### Derived Data

Filtered tasks, sorted tasks, and statistics are calculated from existing state.

```jsx
const filteredTasks = tasks.filter(...);
const sortedTasks = [...filteredTasks].sort(...);
```

These values are not stored separately because doing so would duplicate state and create synchronization risks.

### `useEffect`

Effects are used only when React must synchronize with an external system.

Examples include reading the initial authentication session, subscribing to authentication changes, updating the document theme attribute, registering keyboard listeners, and loading tasks from Supabase.

Effects are not used to calculate values that can be derived during render.

### `useRef`

Refs are used to focus inputs without causing re-renders.

```jsx
const titleInputRef = useRef(null);
const searchInputRef = useRef(null);
```

### Custom Hooks

Task database logic is isolated in `useTasks`.

The hook owns:

- loading tasks
- creating tasks
- updating tasks
- toggling completion
- deleting tasks
- converting database records to UI records
- error state
- loading state

This keeps `App.jsx` focused on orchestration rather than database implementation details.

### Context API

Theme is global UI state, so it is provided through Context.

Context is intentionally not used for every piece of state. Task state remains outside theme context because the current component hierarchy can manage it clearly without introducing unnecessary global state.

---

## Data Model

The PostgreSQL `tasks` table contains:

| Column | Type | Purpose |
|---|---|---|
| `id` | `uuid` | Unique task identifier |
| `user_id` | `uuid` | Owner of the task |
| `title` | `text` | Required task title |
| `description` | `text` | Optional task details |
| `category` | `text` | Personal, Work, Learning, Health, or Other |
| `priority` | `text` | Low, Medium, or High |
| `due_date` | `date` | Optional deadline |
| `completed` | `boolean` | Completion status |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Last-update timestamp |

Example UI object:

```js
{
  id: "f86be31f-...",
  title: "Finish TaskFlow",
  description: "Complete cloud persistence",
  category: "Learning",
  priority: "High",
  dueDate: "2026-08-10",
  completed: false,
  createdAt: "2026-08-07T10:30:00.000Z",
  updatedAt: "2026-08-07T10:30:00.000Z"
}
```

---

## Frontend-to-Database Mapping

The database uses `snake_case`. The React application uses `camelCase`.

```text
Database        React
-----------------------------
due_date        dueDate
created_at      createdAt
updated_at      updatedAt
user_id         userId
```

Conversion functions create a boundary between database representation and UI representation.

```js
function mapDatabaseTask(task) {
  return {
    id: task.id,
    title: task.title,
    dueDate: task.due_date ?? "",
    createdAt: task.created_at,
    updatedAt: task.updated_at,
  };
}
```

This avoids leaking database naming conventions throughout the UI.

---

## Authentication Flow

```text
Application starts
      |
      v
Supabase session check
      |
      +-- No session --> AuthForm
      |
      +-- Session exists --> TaskFlow dashboard
```

The app subscribes to auth state changes so login and logout immediately update the UI.

Authentication operations include:

```js
supabase.auth.signUp(...)
supabase.auth.signInWithPassword(...)
supabase.auth.signOut()
supabase.auth.getSession()
supabase.auth.onAuthStateChange(...)
```

Supabase stores the authenticated session and sends the user's token with database requests.

---

## Row Level Security

TaskFlow does not rely only on frontend checks.

PostgreSQL Row Level Security protects task rows at the database level.

Each task includes a `user_id`. Policies compare the authenticated user's ID with the row owner.

```sql
auth.uid() = user_id
```

The project defines policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.

This means User A cannot read or mutate User B's rows even if User A manually calls the API.

```text
Frontend hiding is UX.
Database authorization is security.
```

---

## Database Constraints

Validation is not limited to React forms.

The database also enforces rules such as:

- title length
- description length
- allowed categories
- allowed priorities
- required user ownership
- default timestamps
- default completion state

This protects the system if requests come from outside the expected UI.

---

## Search Architecture

Search is currently client-side.

```text
Supabase loads the user's tasks
        |
        v
React filters the in-memory array
```

Search does not send an API request on every keypress.

Because of this, debouncing is intentionally not used.

### Why No Debounce?

Debouncing is valuable when typing triggers expensive work such as server requests, database searches, analytics calls, or complex computations.

TaskFlow currently filters already-loaded user tasks in memory. Adding debounce would introduce delay and complexity without reducing network traffic.

For a larger dataset, the architecture would change to:

```text
User types
    |
    v
Debounced search term
    |
    v
Paginated server-side query
    |
    v
Indexed PostgreSQL search
```

This is an intentional trade-off, not an omitted feature.

---

## Filtering and Sorting Pipeline

```text
Raw tasks
   |
   v
Search
   |
   v
Status filter
   |
   v
Category filter
   |
   v
Priority filter
   |
   v
Sorting
   |
   v
Rendered tasks
```

Every task must satisfy all active filter conditions.

```jsx
return (
  matchesSearch &&
  matchesStatus &&
  matchesCategory &&
  matchesPriority
);
```

The original task array is copied before sorting:

```jsx
const sortedTasks = [...filteredTasks].sort(...);
```

JavaScript's `.sort()` mutates arrays. Copying first protects state immutability.

---

## Overdue Calculation

A task is overdue when it has a due date, is not completed, and its due date has passed.

```jsx
const isOverdue =
  task.dueDate &&
  !task.completed &&
  new Date(`${task.dueDate}T23:59:59`) < new Date();
```

Completed tasks are excluded from overdue metrics.

---

## Error and Loading States

Cloud applications must account for asynchronous operations.

TaskFlow includes:

- session-checking state
- task-loading state
- form-submitting state
- database error state
- authentication error state
- disabled buttons during requests
- preserved form values when a request fails

A failed database request should not pretend that the operation succeeded.

---

## Defensive Programming

Persisted or remote data may be incomplete.

```js
const category = task.category || "Personal";
const priority = task.priority || "Medium";
const safeTasks = Array.isArray(tasks) ? tasks : [];
```

Optional values are normalized:

```js
due_date: task.dueDate || null
```

These checks reduce runtime failures and make the UI resilient to older or malformed records.

---

## Accessibility

The project includes:

- labels linked to form controls
- semantic `main`, `section`, and `article` elements
- explicit button types
- checkbox ARIA labels
- progress bar ARIA values
- keyboard shortcuts
- focus management
- visible focus states
- keyboard-accessible actions
- alert roles for errors

---

## Responsive Design

The layout adapts across desktop, tablet, mobile, and small mobile screens.

Responsive areas include:

- task form
- filters
- statistics
- account bar
- task cards
- action buttons
- authentication form

---

## Local Storage to Cloud Migration

TaskFlow originally used `localStorage`.

That version taught browser persistence, JSON serialization, lazy state initialization, and custom storage hooks.

The application was then migrated to Supabase.

```text
Before
------
One browser
One device
No user identity

After
-----
Authenticated account
PostgreSQL storage
Cross-device access
Database-level authorization
```

The migration introduced asynchronous CRUD, loading states, error handling, user ownership, data mapping, environment variables, session management, and cloud deployment.

---

## Technology Stack

### Frontend

- React
- JavaScript
- Vite
- CSS
- Context API
- Custom Hooks

### Backend Platform

- Supabase Auth
- Supabase Data API
- PostgreSQL
- Row Level Security

### Deployment

- GitHub
- Vercel

### Quality

- ESLint
- Production builds
- Environment-variable separation

No UI component library or large state-management library was used. The goal was to understand React and browser fundamentals directly.

---

## Project Structure

```text
src/
├── components/
│   ├── AuthForm.jsx
│   ├── Header.jsx
│   ├── SearchBar.jsx
│   ├── TaskFilters.jsx
│   ├── TaskForm.jsx
│   ├── TaskItem.jsx
│   ├── TaskList.jsx
│   └── TaskStats.jsx
├── context/
│   ├── ThemeContext.jsx
│   └── ThemeProvider.jsx
├── hooks/
│   ├── useTasks.js
│   └── useTheme.js
├── lib/
│   └── supabase.js
├── App.jsx
├── AuthGate.jsx
├── App.css
├── index.css
└── main.jsx
```

---

## How to Use TaskFlow

### Create an Account

1. Open the application.
2. Select **Create account**.
3. Enter an email address and password.
4. Submit the form.
5. Log in if email confirmation is enabled.

### Create a Task

1. Enter a title.
2. Add an optional description.
3. Choose a category.
4. Choose a priority.
5. Select an optional due date.
6. Click **Add Task**.

### Update a Task

1. Click **Edit**.
2. Change the fields.
3. Click **Update Task**.

### Complete a Task

Select the checkbox next to the task.

### Delete a Task

Click **Delete**, then confirm the action.

### Find Tasks

Use search, filters, and sort controls together.

### Access Tasks on Another Device

Log in with the same account. Tasks are loaded from Supabase rather than the original browser.

---

## Local Development

### Prerequisites

Install Node.js, npm, and Git.

### Clone

```bash
git clone https://github.com/your-username/taskflow-react.git
cd taskflow-react
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create `.env.local`:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Never place a `service_role` or secret key in frontend code.

### Run

```bash
npm run dev
```

### Quality Commands

```bash
npm run lint
npm run build
npm run preview
```

---

## Supabase Setup

### Tasks Table

```sql
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null default 'Personal',
  priority text not null default 'Medium',
  due_date date,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### Indexes

```sql
create index tasks_user_id_index
on public.tasks(user_id);

create index tasks_created_at_index
on public.tasks(created_at desc);
```

### Enable RLS

```sql
alter table public.tasks
enable row level security;
```

### Example Policy

```sql
create policy "Users can view their own tasks"
on public.tasks
for select
to authenticated
using (
  auth.uid() = user_id
);
```

Equivalent policies are required for insert, update, and delete.

---

## Vercel Deployment

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Confirm Vite detection.
4. Add `VITE_SUPABASE_URL`.
5. Add `VITE_SUPABASE_PUBLISHABLE_KEY`.
6. Deploy.
7. Add the production URL to Supabase Authentication URL Configuration.
8. Test signup, login, logout, and task operations in an incognito window.

The `.env.local` file is not committed. Production environment values are configured in Vercel.

---

## Security Notes

- The frontend uses a publishable Supabase key.
- The service-role key is never exposed in browser code.
- Row Level Security protects task ownership.
- Database constraints validate accepted values.
- Environment values are not committed.
- Authentication sessions are managed by Supabase.
- Frontend checks improve UX but are not treated as the security boundary.

---

## Scalability

TaskFlow is suitable for portfolio use, demos, learning, and an initial small public release.

The design scales reasonably because static frontend assets are served by Vercel, authentication is managed by Supabase, PostgreSQL provides durable storage, user-scoped indexes support common queries, and RLS isolates data.

For larger usage, the next changes would be:

- server-side pagination
- server-side search
- debounced API queries
- cursor-based loading
- selective column queries
- retry policies
- optimistic updates
- observability
- automated tests
- load testing

No untested claim about concurrent-user capacity is made. Real scale should be determined through monitoring and load testing.

---

## Testing Checklist

### Authentication

- signup succeeds
- login succeeds
- logout succeeds
- session persists after refresh
- invalid credentials show an error

### Tasks

- create succeeds
- update succeeds
- completion toggle succeeds
- delete confirmation works
- database rows reflect the UI

### Security

- User A cannot see User B's tasks
- unauthenticated users cannot read tasks
- `.env.local` is excluded from Git

### Persistence

- refresh preserves tasks
- another device shows the same account data
- logout/login preserves cloud data

### Interface

- dark mode works
- theme persists
- keyboard shortcuts work
- mobile layout works
- loading and error states are visible

---

## Engineering Trade-offs

### Client-Side Search

Chosen because task collections are currently small and already loaded.

**Benefit:** instant results and no API call per keystroke.

**Limit:** unsuitable for very large histories.

### No Debouncing

Chosen because search is in-memory, not server-driven.

**Benefit:** simpler code and immediate feedback.

**Future:** add debounce when search moves to Supabase.

### Local State Instead of a Global Store

Chosen because the hierarchy remains manageable.

**Benefit:** fewer abstractions and easier reasoning.

### Supabase Instead of a Custom Backend

Chosen to focus on React integration, PostgreSQL, authentication, RLS, and production deployment.

**Benefit:** faster delivery with real backend concepts.

**Limit:** less exposure to writing a custom REST server.

### CSS Instead of a Component Library

Chosen because responsive layout and visual states were learning goals.

**Benefit:** direct control and stronger CSS fundamentals.

---

## What I Learned

Building TaskFlow strengthened my understanding of:

- component boundaries
- state ownership
- event-driven UI
- controlled forms
- immutable data updates
- derived state
- custom hooks
- Context API
- effect cleanup
- refs and focus control
- browser persistence
- asynchronous CRUD
- authentication sessions
- database modelling
- PostgreSQL constraints
- Row Level Security
- environment variables
- deployment pipelines
- error and loading states
- responsive design
- accessibility
- technical trade-offs

The most important learning was that frontend engineering is not only about rendering components. It is about designing reliable data flow between the user, the interface, external services, security rules, and persistent storage.

---

## Current Limitations

TaskFlow does not currently include:

- automated unit or integration tests
- team workspaces
- role-based application permissions
- offline synchronization
- push notifications
- recurring tasks
- audit history
- advanced observability
- formal load-test results
- a custom backend service

These are roadmap opportunities, not hidden capabilities.

---

## Roadmap

### Near Term

- password reset
- email confirmation UX
- optimistic updates
- toast notifications
- stronger error classification
- skeleton loading states
- automated component tests

### Medium Term

- pagination
- server-side search
- task labels
- recurring tasks
- drag-and-drop ordering
- real-time updates
- account deletion
- data export

### Advanced

- team workspaces
- organization roles
- audit logs
- activity history
- background jobs
- notifications
- rate limiting
- observability dashboard
- performance budgets
- end-to-end tests

---

## Collaboration

Contributions and engineering discussion are welcome.

Useful areas include:

- React architecture
- accessibility
- PostgreSQL query design
- Supabase RLS review
- testing strategy
- performance profiling
- design-system improvements
- offline support
- real-time collaboration

Suggested workflow:

```bash
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
```

Open a pull request describing the problem, proposed change, trade-offs, testing, and screenshots where relevant.

---

## Beginner Learning Path

Study the repository in this order:

1. `TaskItem.jsx` — props and events
2. `TaskList.jsx` — lists and keys
3. `TaskForm.jsx` — controlled forms and validation
4. `App.jsx` — state ownership and derived data
5. `useTheme.js` and `ThemeProvider.jsx` — Context
6. `AuthGate.jsx` — session-based rendering
7. `useTasks.js` — asynchronous CRUD and data mapping
8. `supabase.js` — external client configuration
9. Supabase SQL — schema, indexes, constraints, and RLS
10. Vercel configuration — deployment and environment variables

This path moves from basic React to full-stack integration.

---

## Resume-Ready Summary

> Built and deployed a responsive React task-management application using Supabase Auth, PostgreSQL, Row Level Security, API-based CRUD operations, custom hooks, Context API, controlled forms, derived filtering and sorting, cloud persistence, keyboard accessibility, and Vercel deployment.

---

## Author

**Puneet Khanna**

Frontend Engineer focused on React, JavaScript, reusable UI systems, frontend architecture, performance, accessibility, and maintainable product development.

Add your LinkedIn, GitHub, email, and portfolio links here.

---

## Project Status

```text
Frontend application        Complete
Authentication              Complete
Cloud database              Complete
Row Level Security          Complete
Vercel deployment           Complete
Automated test coverage     Planned
Server-side search          Planned
Team collaboration          Planned
```

TaskFlow is complete as an end-to-end learning and portfolio project, with a clear roadmap for production hardening.
