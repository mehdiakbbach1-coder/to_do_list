# Requirements Contract

This document describes the user requirements for the single-user To-Do application and how each requirement can be verified.

## Functional requirements

| ID | Requirement | Verification |
|---|---|---|
| FR-1 | A single user can view all tasks in one list. | Start backend and frontend, create several tasks, and confirm they appear together in the main list view. Refresh the page and confirm the list still loads from the API/SQLite. |
| FR-2 | A user can add a task with a title. | Enter a non-empty title in the add form and submit. Confirm the task appears in the list and a `POST /api/todos` request succeeds with status `201`. |
| FR-3 | A user can rename an existing task. | Use the Rename action on a task, change the title to a new valid value, save, and confirm the updated title is shown and persisted after refresh. |
| FR-4 | A user can mark a task as completed. | Toggle a task’s checkbox/status control to completed. Confirm the UI reflects completion and `PUT /api/todos/:id` returns the task with `completed: true`. |
| FR-5 | A user can mark a completed task as active again. | Toggle a completed task back to active. Confirm the UI reflects active state and persistence after refresh. |
| FR-6 | A user can delete a task. | Delete a task and confirm it disappears from the list. Refresh the browser and restart the server, then confirm the task remains deleted. |
| FR-7 | A user can switch between All, Active, and Completed filters without reloading the page. | Click All/Active/Completed filter controls and confirm the visible tasks change accordingly without a full page reload (SPA state/UI update). |

## Rules and behavior

| ID | Requirement | Verification |
|---|---|---|
| BR-1 | New tasks must start as active. | Create a new task and confirm it is not marked completed (`completed: false`) in the UI and API response. |
| BR-2 | Empty or whitespace-only titles must be rejected. | Try submitting an empty title and a whitespace-only title when adding or renaming. Confirm a clear validation message is shown and no invalid task is saved. |
| BR-3 | A clear validation message is shown when a title is invalid. | Trigger invalid-title cases in the UI and confirm an understandable message appears (e.g. “Task title must not be empty or contain only whitespace.”). |
| BR-4 | If saving fails, display an understandable error message and preserve the last successfully saved task state in the interface. | With tasks loaded, stop the backend or force a request failure, then attempt add/rename/toggle/delete. Confirm an error message is displayed and the list reverts/remains at the last successfully saved state. |
| BR-5 | Display a short message when the task list is empty. | Ensure no tasks exist (or filter results in none) and confirm a short “No tasks to show.” message is displayed. |
| BR-6 | Task titles and completion states must persist after browser refresh and server restart. | Create/update/toggle tasks, refresh the browser, stop and restart the backend, refresh again, and confirm data matches the last successful state. |
| BR-7 | Deleted tasks must remain deleted after refresh or server restart. | Delete a task, refresh, restart backend, and confirm it does not reappear. |
| BR-8 | The Express API must also reject invalid titles, not just the frontend. | Send `POST /api/todos` and `PUT /api/todos/:id` requests with empty/whitespace/missing-string titles (e.g. via curl/Postman) and confirm `400` responses with a JSON error message. |

## Architecture and data persistence

| ID | Requirement | Verification |
|---|---|---|
| AR-1 | Data flow follows: Vue components → Pinia store → API client → Express REST API → SQLite database. | Inspect code structure: components emit/call store actions, store uses `frontend/src/api/todos.js`, API client calls `/api/todos`, backend routes use SQLite access in `backend/src/db`. |
| AR-2 | Changes are sent to Express, validated, saved in SQLite, returned, and Pinia/UI updated only after a successful response. | Observe network requests during add/rename/toggle/delete; confirm UI updates on success and that failed requests show errors while preserving last successful state. |
| AR-3 | SQLite is the source of persistent task data (no localStorage as main database). | Inspect frontend code for absence of localStorage-based persistence for tasks and confirm data persists via backend/database across refresh and server restart. |
| AR-4 | Frontend and backend run locally. | Start backend (`npm start` in `backend`) and frontend (`npm run dev` in `frontend`) and use the app in a local browser. |

## Database requirements

| ID | Requirement | Verification |
|---|---|---|
| DB-1 | SQLite database file is created locally with initialization and a `todos` table. | Start backend and confirm `backend/data/todos.db` exists and contains a `todos` table. |
| DB-2 | `todos` table contains at least `id`, `title`, `completed`, `created_at` with suitable types/constraints. | Inspect schema/initialization in `backend/src/db/database.js` and verify columns/constraints (PK, NOT NULL, default/check for completed, timestamp). |
| DB-3 | Database file and `node_modules` are not committed to Git. | Inspect `.gitignore` files to confirm SQLite db patterns and `node_modules/` are ignored. |
