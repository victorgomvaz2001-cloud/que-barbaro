import { Router, type Router as IRouter } from 'express'
import * as seoController from '../controllers/seo.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router: IRouter = Router()

// Public
router.get('/', seoController.getByRoute)

// Admin
router.get('/admin', authMiddleware, seoController.getAll)
router.get('/admin/:id', authMiddleware, seoController.getById)
router.post('/admin', authMiddleware, seoController.create)
router.put('/admin/:id', authMiddleware, seoController.update)
router.delete('/admin/:id', authMiddleware, seoController.remove)

export default router
