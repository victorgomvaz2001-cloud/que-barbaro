import { Router, type Router as IRouter } from 'express'
import * as categoryController from '../controllers/category.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router: IRouter = Router()

// Public
router.get('/', categoryController.getAll)

// Admin
router.get('/admin/:id', authMiddleware, categoryController.getById)
router.post('/admin', authMiddleware, categoryController.create)
router.put('/admin/:id', authMiddleware, categoryController.update)
router.delete('/admin/:id', authMiddleware, categoryController.remove)

export default router
