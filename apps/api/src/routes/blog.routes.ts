import { Router, type Router as IRouter } from 'express'
import * as blogController from '../controllers/blog.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router: IRouter = Router()

// Public
router.get('/', blogController.getAll)
router.get('/page', blogController.getPage)
router.get('/categories', blogController.getCategories)
router.get('/:slug', blogController.getBySlug)

// Admin
router.delete('/admin/bulk', authMiddleware, blogController.bulkRemove)
router.get('/admin/list', authMiddleware, blogController.getAll)
router.get('/admin/:id', authMiddleware, blogController.getById)
router.post('/admin', authMiddleware, blogController.create)
router.put('/admin/:id', authMiddleware, blogController.update)
router.delete('/admin/:id', authMiddleware, blogController.remove)

export default router
