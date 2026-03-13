import express, { type Express } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import routes from './routes/index'
import { errorMiddleware } from './middleware/error.middleware'

const app: Express = express()

// Security
app.use(helmet())
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
)

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('combined'))
}

// Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Routes
app.use('/api', routes)

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'Route not found', statusCode: 404 })
})

// Error handler
app.use(errorMiddleware)

export default app
