import { Router, type Router as IRouter } from 'express'
import * as promotionController from '../controllers/promotion.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router: IRouter = Router()

// Public - active promotion for the banner
router.get('/active', promotionController.getActive)

// Admin
router.delete('/admin/bulk',        authMiddleware, promotionController.bulkRemove)
router.get('/admin/list',          authMiddleware, promotionController.getAll)
router.post('/admin',              authMiddleware, promotionController.create)
router.put('/admin/:id',           authMiddleware, promotionController.update)
router.put('/admin/:id/activate',  authMiddleware, promotionController.activate)
router.put('/admin/:id/deactivate', authMiddleware, promotionController.deactivate)
router.delete('/admin/:id',        authMiddleware, promotionController.remove)

export default router
