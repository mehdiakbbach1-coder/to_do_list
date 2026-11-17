import app from './app.js'
import { initializeDatabase } from './db/database.js'

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    await initializeDatabase()
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
