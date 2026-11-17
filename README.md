# Assignment 2 — Full-Stack To-Do Application

A single-user To-Do application built with **Vue 3 + Pinia** (frontend), **Express** (backend), and **SQLite** (local database file).

## Project structure

- `frontend/` — Vue 3 SPA (Vite + Pinia)
- `backend/` — Express REST API and SQLite persistence
  - `backend/data/todos.db` — local SQLite database file (created automatically on first backend start)

## Prerequisites

- Node.js (frontend `package.json` specifies `^22.18.0 || >=24.12.0`)
- npm

## Installation

Install dependencies separately for backend and frontend:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Running the application locally

You need two terminals.

### 1. Start the backend (Express + SQLite)

```bash
cd backend
npm start
```

- Runs on `http://localhost:3000`
- Initializes the SQLite database and `todos` table automatically (`backend/data/todos.db`)

For development with auto-restart (Node watch):

```bash
cd backend
npm run dev
```

### 2. Start the frontend (Vue 3 + Vite)

```bash
cd frontend
npm run dev
```

- Vite dev server runs locally (default `http://localhost:5173`)
- API requests to `/api/*` are proxied to `http://localhost:3000` (configured in `frontend/vite.config.js`)

Open the frontend URL shown in the terminal in your browser.

## Build

To verify the frontend builds successfully:

```bash
cd frontend
npm run build
```

## API

See [`API_CONTRACT.md`](./API_CONTRACT.md) for endpoints, request/response bodies, and status codes.

## Notes

- SQLite is the source of persistent task data (no `localStorage` used for persistence).
- The backend validates task titles and returns JSON error messages.
- `node_modules/` and the SQLite database files are excluded from Git via `.gitignore`.
