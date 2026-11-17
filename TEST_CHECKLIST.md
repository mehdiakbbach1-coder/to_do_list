# Manual Test Checklist

Use this checklist to manually verify the Assignment 2 To-Do application. Start the backend (`cd backend && npm start`) and frontend (`cd frontend && npm run dev`) before testing.

## Setup and startup

- [ ] **Install backend:** Run `npm install` in `backend/` without errors.
- [ ] **Install frontend:** Run `npm install` in `frontend/` without errors.
- [ ] **Start backend:** Run `npm start` in `backend/`; server starts on `http://localhost:3000` and initializes `backend/data/todos.db`.
- [ ] **Start frontend:** Run `npm run dev` in `frontend/`; Vite serves the SPA locally and `/api` requests reach the backend.
- [ ] **Build frontend:** Run `npm run build` in `frontend/`; build completes successfully.

## Core task operations

- [ ] **View all tasks (FR-1):** With multiple tasks present, all tasks are visible in one list.
- [ ] **Add task (FR-2):** Enter a valid title and submit; task appears in the list.
- [ ] **New task starts active (BR-1):** Newly added task is not completed (`Active` state).
- [ ] **Rename task (FR-3):** Rename an existing task to a valid title; updated title is shown.
- [ ] **Mark completed (FR-4):** Mark an active task as completed; UI reflects completed state.
- [ ] **Mark active again (FR-5):** Mark a completed task as active; UI reflects active state.
- [ ] **Delete task (FR-6):** Delete a task; it is removed from the list.

## Filters (SPA behavior)

- [ ] **All filter (FR-7):** Shows all tasks.
- [ ] **Active filter (FR-7):** Shows only active (not completed) tasks.
- [ ] **Completed filter (FR-7):** Shows only completed tasks.
- [ ] **No page reload (FR-7):** Switching filters updates the view without a full browser reload.

## Validation and error handling

- [ ] **Reject empty title on add (BR-2/BR-3):** Submit empty title; clear validation message shown and task not created.
- [ ] **Reject whitespace-only title on add (BR-2/BR-3):** Submit spaces/tabs only; validation message shown and task not created.
- [ ] **Reject invalid title on rename (BR-2/BR-3):** Attempt to rename to empty/whitespace; validation message shown and title not saved.
- [ ] **Backend rejects invalid titles (BR-8):** Send `POST /api/todos` with `{ "title": "   " }` and `PUT /api/todos/:id` with invalid/empty title via curl/Postman; receive `400` with JSON `{ "error": ... }`.
- [ ] **Save failure handling (BR-4):** Stop backend, attempt add/rename/toggle/delete; understandable error message displayed and UI preserves last successfully saved task state.
- [ ] **Empty list message (BR-5):** When no tasks exist (or current filter has none), a short “No tasks to show.” message is displayed.

## Persistence

- [ ] **Persist after browser refresh (BR-6):** Create/update/toggle tasks, refresh browser; titles and completion states remain.
- [ ] **Persist after server restart (BR-6):** Stop and restart backend, refresh frontend; tasks and states remain.
- [ ] **Deleted tasks stay deleted (BR-7):** Delete a task, refresh browser and restart backend; task does not reappear.
- [ ] **SQLite is source of truth (AR-3):** Confirm `backend/data/todos.db` exists and reflects stored tasks (no reliance on localStorage for persistence).

## API sanity checks (optional but recommended)

- [ ] `GET /api/todos` returns `200` and a JSON array of tasks.
- [ ] `POST /api/todos` with valid title returns `201` and created task (`completed: false`).
- [ ] `PUT /api/todos/:id` updates title/completed and returns `200` with updated task.
- [ ] `DELETE /api/todos/:id` returns `200` with success message.
- [ ] Requests for non-existent IDs return `404` with JSON error.
- [ ] Invalid JSON body returns `400` with `{ "error": "Invalid JSON in request body." }`.
