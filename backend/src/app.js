import cors from 'cors'
import express from 'express'
import todosRouter from './routes/todos.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/api/todos', todosRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' })
})

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'Invalid JSON in request body.' })
    return
  }
  res.status(500).json({ error: 'Internal server error.' })
})

export default app
