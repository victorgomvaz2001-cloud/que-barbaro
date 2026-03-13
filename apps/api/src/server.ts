import 'dotenv/config' // Load .env before any other import
import './config/env' // Validate env variables
import app from './app'
import { connectDatabase } from './config/database'
import { env } from './config/env'

async function start() {
  await connectDatabase()

  app.listen(env.PORT, () => {
    console.warn(`API server running on http://localhost:${env.PORT}`)
  })
}

start()
