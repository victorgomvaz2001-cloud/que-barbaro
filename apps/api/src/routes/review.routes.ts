import { Router, type Router as IRouter } from 'express'
import * as reviewController from '../controllers/review.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router: IRouter = Router()

// Public - selected reviews for testimonials
router.get('/', reviewController.getSelected)

// Admin
router.put('/admin/reorder', authMiddleware, reviewController.reorder)
router.delete('/admin/bulk', authMiddleware, reviewController.bulkRemove)
router.get('/admin/list',    authMiddleware, reviewController.getAll)
router.post('/admin/sync',   authMiddleware, reviewController.syncFromGoogle)
router.post('/admin',        authMiddleware, reviewController.create)
router.put('/admin/:id',     authMiddleware, reviewController.update)
router.delete('/admin/:id',  authMiddleware, reviewController.remove)

export default router
