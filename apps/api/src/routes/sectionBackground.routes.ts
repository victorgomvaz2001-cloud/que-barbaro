import { Router, type Router as IRouter } from 'express'
import * as ctrl from '../controllers/sectionBackground.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router: IRouter = Router()

// Public
router.get('/:pageSlug', ctrl.getByPage)

// Admin
router.put('/admin/:pageSlug/:sectionKey',    authMiddleware, ctrl.upsert)
router.delete('/admin/:pageSlug/:sectionKey', authMiddleware, ctrl.remove)

export default router
