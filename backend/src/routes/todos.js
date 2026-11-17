import express from 'express'
import { all, get, run } from '../db/database.js'

const router = express.Router()

function toTodo(row) {
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    completed: Boolean(row.completed),
    created_at: row.created_at,
  }
}

function validateTitle(title) {
  if (typeof title !== 'string' || title.trim().length === 0) {
    return 'Task title must not be empty or contain only whitespace.'
  }
  return null
}

router.get('/', async (req, res) => {
  try {
    const rows = await all('SELECT id, title, completed, created_at FROM todos ORDER BY id ASC')
    res.status(200).json(rows.map(toTodo))
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks.' })
  }
})

router.post('/', async (req, res) => {
  const validationError = validateTitle(req.body?.title)
  if (validationError) {
    res.status(400).json({ error: validationError })
    return
  }

  const title = req.body.title.trim()

  try {
    const result = await run('INSERT INTO todos (title, completed) VALUES (?, 0)', [title])
    const row = await get('SELECT id, title, completed, created_at FROM todos WHERE id = ?', [result.lastID])
    res.status(201).json(toTodo(row))
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task.' })
  }
})

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'Task id must be a positive integer.' })
    return
  }

  const hasTitle = Object.prototype.hasOwnProperty.call(req.body || {}, 'title')
  const hasCompleted = Object.prototype.hasOwnProperty.call(req.body || {}, 'completed')

  if (!hasTitle && !hasCompleted) {
    res.status(400).json({ error: 'Provide at least a title or completed value to update.' })
    return
  }

  let title
  if (hasTitle) {
    const validationError = validateTitle(req.body.title)
    if (validationError) {
      res.status(400).json({ error: validationError })
      return
    }
    title = req.body.title.trim()
  }

  let completed
  if (hasCompleted) {
    if (typeof req.body.completed !== 'boolean') {
      res.status(400).json({ error: 'Completed value must be a boolean.' })
      return
    }
    completed = req.body.completed ? 1 : 0
  }

  try {
    const existing = await get('SELECT id, title, completed, created_at FROM todos WHERE id = ?', [id])
    if (!existing) {
      res.status(404).json({ error: 'Task not found.' })
      return
    }

    const nextTitle = hasTitle ? title : existing.title
    const nextCompleted = hasCompleted ? completed : existing.completed

    await run('UPDATE todos SET title = ?, completed = ? WHERE id = ?', [nextTitle, nextCompleted, id])
    const row = await get('SELECT id, title, completed, created_at FROM todos WHERE id = ?', [id])
    res.status(200).json(toTodo(row))
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task.' })
  }
})

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'Task id must be a positive integer.' })
    return
  }

  try {
    const existing = await get('SELECT id FROM todos WHERE id = ?', [id])
    if (!existing) {
      res.status(404).json({ error: 'Task not found.' })
      return
    }

    await run('DELETE FROM todos WHERE id = ?', [id])
    res.status(200).json({ message: 'Task deleted successfully.' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task.' })
  }
})

export default router
