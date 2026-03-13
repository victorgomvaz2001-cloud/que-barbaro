import { Router, type Router as IRouter } from 'express'
import { login, register, logout, me } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { z } from 'zod'

const router: IRouter = Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(['admin', 'editor']).optional(),
})

router.post('/login', validate(loginSchema), login)
router.post('/register', validate(registerSchema), register)
router.post('/logout', logout)
router.get('/me', authMiddleware, me)

export default router
