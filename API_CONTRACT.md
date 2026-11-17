# API Contract — To-Do Application

Base URL (local development, via Vite proxy): `http://localhost:5173/api`  
Backend direct base URL: `http://localhost:3000/api`

All request and response bodies are JSON. Invalid requests return a JSON object with an `error` message.

## Task resource

```json
{
  "id": 1,
  "title": "Buy milk",
  "completed": false,
  "created_at": "2026-11-17 12:00:00"
}
```

- `id` (integer): unique task identifier
- `title` (string): task title (trimmed, non-empty)
- `completed` (boolean): `false` = active, `true` = completed
- `created_at` (string): creation timestamp stored by SQLite

## Endpoints

### 1. Get all tasks

- **Method:** `GET`
- **URL:** `/api/todos`
- **Request body:** none

**Success response — 200 OK**
```json
[
  {
    "id": 1,
    "title": "Buy milk",
    "completed": false,
    "created_at": "2026-11-17 12:00:00"
  }
]
```

**Error response — 500 Internal Server Error**
```json
{ "error": "Failed to fetch tasks." }
```

---

### 2. Create a task

- **Method:** `POST`
- **URL:** `/api/todos`
- **Headers:** `Content-Type: application/json`
- **Request body:**
```json
{ "title": "Buy milk" }
```

**Validation rules**
- `title` is required and must be a string.
- `title` must not be empty or contain only whitespace (trimmed on save).
- New tasks are created with `completed = false`.

**Success response — 201 Created**
```json
{
  "id": 1,
  "title": "Buy milk",
  "completed": false,
  "created_at": "2026-11-17 12:00:00"
}
```

**Error response — 400 Bad Request** (invalid title)
```json
{ "error": "Task title must not be empty or contain only whitespace." }
```

**Error response — 400 Bad Request** (invalid JSON)
```json
{ "error": "Invalid JSON in request body." }
```

**Error response — 500 Internal Server Error**
```json
{ "error": "Failed to create task." }
```

---

### 3. Update/rename a task or change completion status

- **Method:** `PUT`
- **URL:** `/api/todos/:id`
- **Headers:** `Content-Type: application/json`
- **URL params:** `id` — positive integer task ID
- **Request body:** at least one of `title` or `completed`
```json
{ "title": "Buy oat milk" }
```
```json
{ "completed": true }
```
```json
{ "title": "Buy oat milk", "completed": true }
```

**Validation rules**
- `id` must be a positive integer.
- At least `title` or `completed` must be provided.
- If provided, `title` must be a non-empty, non-whitespace string (trimmed).
- If provided, `completed` must be a boolean.

**Success response — 200 OK**
```json
{
  "id": 1,
  "title": "Buy oat milk",
  "completed": true,
  "created_at": "2026-11-17 12:00:00"
}
```

**Error responses — 400 Bad Request**
```json
{ "error": "Task id must be a positive integer." }
```
```json
{ "error": "Provide at least a title or completed value to update." }
```
```json
{ "error": "Task title must not be empty or contain only whitespace." }
```
```json
{ "error": "Completed value must be a boolean." }
```

**Error response — 404 Not Found**
```json
{ "error": "Task not found." }
```

**Error response — 500 Internal Server Error**
```json
{ "error": "Failed to update task." }
```

---

### 4. Delete a task

- **Method:** `DELETE`
- **URL:** `/api/todos/:id`
- **URL params:** `id` — positive integer task ID
- **Request body:** none

**Success response — 200 OK**
```json
{ "message": "Task deleted successfully." }
```

**Error response — 400 Bad Request**
```json
{ "error": "Task id must be a positive integer." }
```

**Error response — 404 Not Found**
```json
{ "error": "Task not found." }
```

**Error response — 500 Internal Server Error**
```json
{ "error": "Failed to delete task." }
```

---

### 5. Health check (auxiliary)

- **Method:** `GET`
- **URL:** `/api/health`
- **Request body:** none

**Success response — 200 OK**
```json
{ "status": "ok" }
```

## Notes

- The API rejects invalid titles on the server; the frontend also performs client-side validation for immediate feedback.
- Unknown routes return `404` with `{ "error": "Route not found." }`.
- CORS is enabled for local development.
