import { Router, type Router as IRouter } from 'express'
import * as locationController from '../controllers/location.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router: IRouter = Router()

// Public
router.get('/', locationController.getAll)

// Admin
router.get('/admin/list', authMiddleware, locationController.getAll)
router.get('/admin/:id', authMiddleware, locationController.getById)
router.post('/admin', authMiddleware, locationController.create)
router.put('/admin/:id', authMiddleware, locationController.update)
router.delete('/admin/:id', authMiddleware, locationController.remove)

export default router
