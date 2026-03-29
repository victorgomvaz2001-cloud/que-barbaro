import { Router, type Router as IRouter } from 'express'
import * as mentionController from '../controllers/mention.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router: IRouter = Router()

// Public - visible mentions for the section
router.get('/', mentionController.getVisible)

// Admin
router.get('/admin/list',     authMiddleware, mentionController.getAll)
router.get('/admin/config',   authMiddleware, mentionController.getConfig)
router.put('/admin/config',   authMiddleware, mentionController.updateConfig)
router.post('/admin',         authMiddleware, mentionController.create)
router.put('/admin/:id',      authMiddleware, mentionController.update)
router.delete('/admin/:id',   authMiddleware, mentionController.remove)

export default router
