import { Router, type Router as IRouter } from 'express'
import * as galleryController from '../controllers/gallery.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router: IRouter = Router()

// Public — paginated
router.get('/', galleryController.getPage)

// Admin
router.get('/admin/list', authMiddleware, galleryController.getAll)
router.post('/admin',     authMiddleware, galleryController.create)
router.put('/admin/:id',  authMiddleware, galleryController.update)
router.delete('/admin/:id', authMiddleware, galleryController.remove)

export default router
